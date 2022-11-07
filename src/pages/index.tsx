import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: codeSnippet, refetch } = trpc.code.getSnippet.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const onInput = (evt: KeyboardEvent) => {
    if (!codeSnippet) return;

    if (evt.key === "Backspace" || evt.key === "Delete") {
      return;
    }

    setInput((input) => {
      if (codeSnippet[input.length] === "\n") {
        if (evt.key === "Enter") {
          // Look for the number of spaces at the start of the next line and automatically add them
          const numSpaces =
            codeSnippet.slice(input.length + 1).match(/^(\ +)/)?.[0]?.length ??
            0;

          return input + "\n" + " ".repeat(numSpaces);
        }
      }

      if (evt.key === codeSnippet[input.length]) {
        return input + evt.key;
      }

      return input;
    });
  };

  useEffect(() => {
    setInput("");
    console.log("Adding event listener");
    document.addEventListener("keydown", onInput);

    hljs.registerLanguage("typescript", typescript);
    hljs.highlightAll();

    return () => {
      console.log("Removing event listener");
      document.removeEventListener("keydown", onInput);
      hljs.unregisterLanguage("typescript");
    };
  }, [codeSnippet]); // eslint-disable-line react-hooks/exhaustive-deps

  const [input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [cps, setCps] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  useEffect(() => {
    if (!hasStartedTyping && input.length === 1) {
      setHasStartedTyping(true);
    }

    if (hasStartedTyping && input.length === codeSnippet?.length) {
      setHasStartedTyping(false);
    }
  }, [input, codeSnippet, hasStartedTyping]);

  useEffect(() => {
    if (!hasStartedTyping) return;

    const interval = setInterval(() => {
      setCurrentTime((time) => time + 0.01);
    }, 10);

    return () => clearInterval(interval);
  }, [hasStartedTyping]);

  if (!codeSnippet) return null;

  return (
    <>
      <Head>
        <title>Code Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen w-full flex-col p-4">
        <div className="my-auto flex h-full items-center justify-center">
          <div className="flex w-fit rounded-xl bg-gray-700 p-6">
            <pre>
              <code className="language-typescript">
                {codeSnippet?.toString()}
              </code>
            </pre>
            <pre className="absolute p-4">
              <code className="nohighlight border-grey-400 animate-pulse border-r-2 border-solid bg-emerald-400 bg-opacity-10 text-transparent transition-all">
                {codeSnippet
                  ?.toString()
                  .split("")
                  .slice(0, input.length)
                  .map((char, i) => (
                    // zero width space to move the fake 'cursor' to the beginning of the next line
                    <span key={i}>{char === "\n" ? char + "​" : char}</span>
                  ))}
              </code>
            </pre>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl bg-gray-700 p-2">
          <div
            className={`${
              hasStartedTyping
                ? "badge-info"
                : input.length > 0
                ? "badge-success"
                : "badge-warning"
            } badge`}
          >
            {hasStartedTyping
              ? "Typing"
              : input.length > 0
              ? "Finished"
              : "Not Started"}
          </div>
          <div className="badge">
            CPS:{" "}
            {input.length > 0 ? (input.length / currentTime).toFixed(2) : 0}
          </div>
          <div className="badge mr-auto">Time: {currentTime.toFixed(2)}</div>

          <button
            className="btn"
            onClick={() => {
              refetch();
              setCurrentTime(0);
              setHasStartedTyping(false);
            }}
          >
            Generate New
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
