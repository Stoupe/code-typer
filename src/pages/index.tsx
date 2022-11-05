import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: codeSnippet } = trpc.code.getSnippet.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

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

  return (
    <>
      <Head>
        <title>Code Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex rounded-xl bg-gray-700 p-6">
          <pre>
            <code className="language-typescript">
              {codeSnippet?.toString()}
            </code>
          </pre>
          <pre className="absolute p-4">
            <code className="nohighlight border-grey-400 animate-pulse border-r-2 border-solid bg-yellow-100 bg-opacity-10 text-transparent transition-all">
              {codeSnippet
                ?.toString()
                .split("")
                .slice(0, input.length)
                .map((char, i) => (
                  <span key={i} className="">
                    {char}
                  </span>
                ))}
            </code>
          </pre>
        </div>
      </main>
    </>
  );
};

export default Home;
