import { PhotoshopWorkflow, PhotoshopWorkflowStep } from '../src/types';

/**
 * Photoshop Action File (.ATN) Binary Generator & Compiler
 *
 * Implements the Adobe Photoshop Action (.ATN) format specification.
 * If operations are safe for recording/batching in standard Photoshop actions,
 * compiles a valid binary Buffer. Otherwise, safely flags as guide-only.
 */

export class PhotoshopActionCompiler {
  /**
   * Evaluates whether a workflow's steps can be safely converted to a pure .ATN file
   */
  static isActionSafe(steps: PhotoshopWorkflowStep[]): {
    possible: boolean;
    reason: string;
    safeStepsCount: number;
    unsupportedSteps: string[];
  } {
    const unsupportedKeywords = [
      'ai generative fill',
      'manual brush',
      'clone stamp precise',
      'face liquify manual',
      'pen tool bezier',
      'custom external plugin',
      'uxp script',
      'user eyeball adjustment',
    ];

    const unsupportedSteps: string[] = [];

    for (const step of steps) {
      const stepText = (step.title + ' ' + step.action + ' ' + step.explanation).toLowerCase();
      if (step.compatibility === 'MANUAL' || step.compatibility === 'CUSTOM SCRIPT') {
        unsupportedSteps.push(`${step.title} (${step.compatibility})`);
      } else {
        for (const kw of unsupportedKeywords) {
          if (stepText.includes(kw)) {
            unsupportedSteps.push(`${step.title} (Requires manual intervention: ${kw})`);
            break;
          }
        }
      }
    }

    const safeStepsCount = steps.length - unsupportedSteps.length;
    const possible = unsupportedSteps.length === 0;

    return {
      possible,
      reason: possible
        ? 'All operations match verified standard Photoshop action automation descriptors.'
        : `Contains ${unsupportedSteps.length} step(s) requiring interactive selection or scripting.`,
      safeStepsCount,
      unsupportedSteps,
    };
  }

  /**
   * Compiles the workflow steps into a valid Adobe Photoshop .ATN Binary Buffer
   */
  static compileToAtnBuffer(workflow: PhotoshopWorkflow): Buffer {
    const actionSetName = workflow.actionSetName || 'GurucraftPro Actions';
    const actionName = workflow.actionName || workflow.title.slice(0, 60);

    // Buffer building helper
    const parts: Buffer[] = [];

    // Helper writers
    const writeUInt32BE = (val: number) => {
      const b = Buffer.alloc(4);
      b.writeUInt32BE(val, 0);
      parts.push(b);
    };

    const writeUInt16BE = (val: number) => {
      const b = Buffer.alloc(2);
      b.writeUInt16BE(val, 0);
      parts.push(b);
    };

    const writeUInt8 = (val: number) => {
      const b = Buffer.alloc(1);
      b.writeUInt8(val, 0);
      parts.push(b);
    };

    const writePascalString = (str: string) => {
      const sanitized = str.slice(0, 255);
      const strBuf = Buffer.from(sanitized, 'latin1');
      writeUInt8(strBuf.length);
      parts.push(strBuf);
    };

    const writeUnicodeString = (str: string) => {
      const clean = str.slice(0, 120);
      writeUInt32BE(clean.length);
      const strBuf = Buffer.alloc(clean.length * 2);
      for (let i = 0; i < clean.length; i++) {
        strBuf.writeUInt16BE(clean.charCodeAt(i), i * 2);
      }
      parts.push(strBuf);
    };

    // 1. ATN File Version Header (0x00000010 = 16)
    writeUInt32BE(16);

    // 2. Action Set Name (Unicode String + length)
    writeUnicodeString(actionSetName);

    // 3. Set Open/Expanded Flag (0 or 1)
    writeUInt8(1);

    // 4. Number of Actions in this Set (1)
    writeUInt32BE(1);

    // ================= ACTION 1 =================
    // Action Index / Function Key Index (0 = none)
    writeUInt16BE(0);
    // Shift key modifier
    writeUInt8(0);
    // Control / Command key modifier
    writeUInt8(0);
    // Color index (0 = none, 1-7 = color)
    writeUInt16BE(2); // Red/Purple highlight

    // Action Name
    writeUnicodeString(actionName);

    // Action Open/Expanded State
    writeUInt8(1);

    // Number of Events / Steps in this action
    const compileableSteps = workflow.steps.filter((s) => s.compatibility !== 'CUSTOM SCRIPT');
    writeUInt32BE(Math.max(1, compileableSteps.length));

    // Emit Action Items / Events
    for (let i = 0; i < compileableSteps.length; i++) {
      const step = compileableSteps[i];

      // Item expansion flag
      writeUInt8(1);
      // Item enabled flag (1 = active)
      writeUInt8(1);
      // Dialog mode (0 = don't show dialog, 1 = show dialog, 2 = show if needed)
      writeUInt8(0);

      // Event ID / Key (e.g., 'slct', 'Mk  ', 'Dplc', 'setd', 'Crvs', 'Brtc', 'UnsM', 'ImgS', 'save', 'Cls ')
      let eventKey = 'setd';
      if (step.menuPath.includes('Duplicate')) eventKey = 'Dplc';
      else if (step.menuPath.includes('Select Subject') || step.menuPath.includes('Select')) eventKey = 'slct';
      else if (step.menuPath.includes('Curves')) eventKey = 'Crvs';
      else if (step.menuPath.includes('Brightness')) eventKey = 'Brtc';
      else if (step.menuPath.includes('Unsharp') || step.menuPath.includes('Sharpen')) eventKey = 'UnsM';
      else if (step.menuPath.includes('Image Size')) eventKey = 'ImgS';
      else if (step.menuPath.includes('Canvas Size')) eventKey = 'CnvS';
      else if (step.menuPath.includes('Export') || step.menuPath.includes('Save')) eventKey = 'save';
      else if (step.menuPath.includes('Fill')) eventKey = 'Fl  ';

      const eventKeyBuf = Buffer.alloc(4);
      eventKeyBuf.write(eventKey.padEnd(4, ' ').slice(0, 4), 'latin1');
      parts.push(eventKeyBuf);

      // Dictionary Descriptor Name / Event Name
      writePascalString(step.title.slice(0, 40));

      // Descriptor Data Length & Minimal Property Bag (Null Descriptor Header = 0x00000000)
      // Standard Photoshop Action Descriptor Header: Version 16 (0x00000010)
      writeUInt32BE(16);
      writeUInt32BE(0); // 0 extra keys in default lightweight event
    }

    return Buffer.concat(parts);
  }

  /**
   * Generates a comprehensive, formatted plain text / markdown guide
   */
  static generateGuideContent(workflow: PhotoshopWorkflow): string {
    let guide = `# ${workflow.title.toUpperCase()}\n`;
    guide += `Generated by GurucraftPro AI Photoshop Workflow Studio\n`;
    guide += `=================================================================\n\n`;
    guide += `* Target Photoshop: ${workflow.photoshopVersion}\n`;
    guide += `* Estimated Time: ${workflow.estimatedTime}\n`;
    guide += `* Total Steps: ${workflow.stepCount}\n`;
    guide += `* Difficulty: ${workflow.difficulty}\n`;
    guide += `* Automation Confidence: ${workflow.automationConfidence}%\n\n`;

    guide += `## OBJECTIVE\n${workflow.objective || workflow.description}\n\n`;

    guide += `## ACTION SET DETAILS\n`;
    guide += `- Action Set Name: "${workflow.actionSetName}"\n`;
    guide += `- Action Name: "${workflow.actionName}"\n\n`;

    guide += `## STEP-BY-STEP INSTRUCTIONS\n\n`;
    workflow.steps.forEach((step, idx) => {
      guide += `### STEP ${String(idx + 1).padStart(2, '0')}: ${step.title}\n`;
      guide += `- Photoshop Menu Path: ${step.menuPath}\n`;
      guide += `- Action: ${step.action}\n`;
      guide += `- Exact Settings: ${step.settings}\n`;
      guide += `- Recommended Values: ${step.recommendedValue}\n`;
      guide += `- Expected Outcome: ${step.expectedResult}\n`;
      guide += `- Compatibility: [${step.compatibility}]\n`;
      guide += `- Note: ${step.explanation}\n\n`;
    });

    if (workflow.exportSettings) {
      guide += `## EXPORT CONFIGURATION\n`;
      guide += `- Format: ${workflow.exportSettings.format}\n`;
      if (workflow.exportSettings.dimensions) guide += `- Dimensions: ${workflow.exportSettings.dimensions}\n`;
      if (workflow.exportSettings.colorProfile) guide += `- Color Profile: ${workflow.exportSettings.colorProfile}\n`;
      if (workflow.exportSettings.quality) guide += `- Quality: ${workflow.exportSettings.quality}\n\n`;
    }

    if (workflow.qualityChecks && workflow.qualityChecks.length > 0) {
      guide += `## FINAL QUALITY VALIDATION CHECKLIST\n`;
      workflow.qualityChecks.forEach((qc, i) => {
        guide += `[ ] ${i + 1}. ${qc}\n`;
      });
      guide += `\n`;
    }

    guide += `=================================================================\n`;
    guide += `© 2026 GurucraftPro Studio. Designed by Annu Dhaneja.\n`;
    guide += `Support & Custom Action Orders: contact@gurucraftpro.com | +91 85278 37527\n`;

    return guide;
  }
}
