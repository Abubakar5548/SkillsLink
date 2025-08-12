import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import Head from 'next/head';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CodeEditorPage() {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [darkTheme, setDarkTheme] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Load from localStorage
  useEffect(() => {
    setHtmlCode(localStorage.getItem('htmlCode') || `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
</head>
<body>

</body>
</html>`);
    setCssCode(localStorage.getItem('cssCode') || 'body { font-family: Arial; }');
    setJsCode(localStorage.getItem('jsCode') || 'console.log("Welcome to SkillLink Code Editor!");');
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('htmlCode', htmlCode);
      localStorage.setItem('cssCode', cssCode);
      localStorage.setItem('jsCode', jsCode);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);

  // Run the code
  const runCode = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, 'text/html');

      const styleTag = document.createElement('style');
      styleTag.innerHTML = cssCode;
      doc.head.appendChild(styleTag);

      const scriptTag = document.createElement('script');
      scriptTag.innerHTML = jsCode;
      doc.body.appendChild(scriptTag);

      const fullHTML = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      setOutput(fullHTML);
    } catch (error) {
      setOutput(<pre style="color: red;">Error rendering output:\n${error.message}</pre>);
    }
  };

  // Export as ZIP
  const exportZip = () => {
    const zip = new JSZip();
    zip.file("index.html", htmlCode);
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "skilllink-code.zip");
    });
  };

  return (
    <>
      <Head>
        <title>SkillLink | Live Code Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container mt-4 px-3">
        <h2 className="text-center mb-4">💻 SkillLink Live Code Editor</h2>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="btn-group mb-2">
            {['html', 'css', 'js'].map(tab => (
              <button
                key={tab}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="btn-group mb-2">
            <button className="btn btn-sm btn-success me-2" onClick={runCode}>
              ▶️ Run Code
            </button>
            <button className="btn btn-sm btn-dark me-2" onClick={exportZip}>
              📦 Export ZIP
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDarkTheme(!darkTheme)}
            >
              Switch to {darkTheme ? 'Light' : 'Dark'} Theme
            </button>
          </div>
        </div>

        <p className="text-muted mb-2">💾 Auto-saved at: {lastSaved || 'Saving...'}</p>

        {/* Code Editor */}
        <CodeMirror
          value={
            activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode
          }
          height="200px"
          extensions={[
            activeTab === 'html' ? html() : activeTab === 'css' ? css() : javascript(),
          ]}
          onChange={(value) => {
            if (activeTab === 'html') setHtmlCode(value);
            else if (activeTab === 'css') setCssCode(value);
            else setJsCode(value);
          }}
          theme={darkTheme ? oneDark : githubLight}
        />

        {/* Output */}
        <div className="mt-4">
          <h5>🔍 Output Preview:</h5>
          <iframe
            title="Output"
            srcDoc={output}
            sandbox="allow-scripts allow-same-origin"
            className="w-100"
            style={{ height: '350px', border: '1px solid #ccc', backgroundColor: 'white' }}
          />
        </div>
      </div>
    </>
  );
}