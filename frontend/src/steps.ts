import { Step, StepType } from './types';

/*
 * Parse input XML and convert it into steps.
 * Eg: Input - 
 * <boltArtifact id=\"project-import\" title=\"Project Files\">
 *  <boltAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </boltAction>
 * <boltAction type="shell">
 *      node index.js
 * </boltAction>
 * </boltArtifact>
 * 
 * Output - 
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 * 
 * The input can have strings in the middle they need to be ignored
 */
export function parseXml(xml: string): Step[] {
  // Basic XML parsing implementation
  const steps: Step[] = [];
  
  // Find all <boltAction> tags
  const actionRegex = /<boltAction.*?>([\s\S]*?)<\/boltAction>/g;
  let match;
  
  while ((match = actionRegex.exec(xml)) !== null) {
    const actionContent = match[0];
    const typeMatch = actionContent.match(/type="([^"]+)"/);
    const type = typeMatch ? typeMatch[1] : '';
    
    if (type === 'file') {
      // Extract file path
      const filePathMatch = actionContent.match(/filePath="([^"]+)"/);
      const path = filePathMatch ? filePathMatch[1] : '';
      const name = path.split('/').pop() || '';
      
      // Extract code content
      const codeContent = match[1]?.trim() || '';
      
      steps.push({
        name: `Create file: ${name}`,
        description: `Create ${path}`,
        type: StepType.CreateFile,
        path,
        code: codeContent
      });
    } else if (type === 'shell') {
      // Extract shell command
      const command = match[1]?.trim() || '';
      
      steps.push({
        name: `Run command: ${command}`,
        description: `Execute: ${command}`,
        type: StepType.RunCommand,
        command
      });
    }
  }
  
  return steps;
}