<h1>Automation Test Boilerplate Project</h1>

<p>This document demonstrates how to run automation tests using a sample boilerplate project. You can maintain and update the source code with any improvements.</p>

<h2>Requirements</h2>

<p>Before you begin, ensure you have the following installed on your machine:</p>
<ul>
  <li><a href="https://nodejs.org/">NodeJS</a></li>
  <li><a href="https://code.visualstudio.com/">Visual Studio Code (VS Code)</a> (optional)</li>
  <li><a href="https://www.postman.com/">Postman</a></li>
  <li><a href="https://www.docker.com/products/docker-desktop">Docker Desktop</a></li>
</ul>

<h2>Steps</h2>

<p>Follow these steps to set up and run the automation tests:</p>

<ol>
  <li><strong>Navigate to the project folder:</strong></li>
  <pre><code>cd postman_testing</code></pre>
  <li><strong>Create needed folders:</strong></li>
  <pre><code>mkdir reports, postman_json, postman_test_case</code></pre>
  <li><strong>Copy needed postman files to folder postman_json.</strong></li>
  <li><strong>Install node modules:</strong></li>
  <pre><code>npm install</code></pre>
  <li><strong>Create empty test case:</strong></li>
  <pre><code>npm run make_empty_folder</code></pre>
  <li><strong>Run the tests:</strong></li>
  <pre><code>npm run test</code></pre>
</ol>

<p>Feel free to update and improve the source code as needed.</p>