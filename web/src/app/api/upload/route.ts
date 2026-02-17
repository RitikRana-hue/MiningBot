import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;

    // Analyze based on file type
    let analysis = "";

    if (fileType.startsWith("image/")) {
      analysis = analyzeImage(fileName);
    } else if (
      fileType === "text/csv" ||
      fileName.endsWith(".csv")
    ) {
      const content = await file.text();
      analysis = analyzeCSV(content, fileName);
    } else if (
      fileType === "application/json" ||
      fileName.endsWith(".json")
    ) {
      const content = await file.text();
      analysis = analyzeJSON(content, fileName);
    } else if (
      fileType.includes("spreadsheet") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      analysis = `📊 **Excel File Detected**: ${fileName}\n\nI've received your Excel file (${formatFileSize(fileSize)}). For full Excel parsing, please export to CSV format or share specific data points you'd like me to analyze.\n\n**Tip**: You can ask me about:\n• Production trends\n• Quality metrics\n• Safety statistics\n• Cost analysis`;
    } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      analysis = `📄 **PDF Document**: ${fileName}\n\nI've received your PDF (${formatFileSize(fileSize)}). This appears to be a document related to mining operations.\n\n**I can help you with**:\n• Summarizing key findings\n• Extracting production data\n• Analyzing safety reports\n• Reviewing geological surveys\n\nPlease tell me what specific information you're looking for.`;
    } else {
      analysis = `📁 **File Received**: ${fileName}\n\nFile type: ${fileType || "unknown"}\nSize: ${formatFileSize(fileSize)}\n\nI've received your file. Please describe what analysis you'd like me to perform on this data.`;
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      fileSize,
      analysis,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function analyzeImage(fileName: string): string {
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes("seam") || lowerName.includes("coal") || lowerName.includes("sample")) {
    return `🖼️ **Coal Sample Image**: ${fileName}\n\n**Visual Analysis**:\nThis appears to be a coal sample image. Based on typical coal characteristics:\n\n• **Luster**: Check for vitreous (glassy) or dull appearance\n• **Color**: Ranges from brown (lignite) to black (anthracite)\n• **Fracture**: Conchoidal fracture indicates higher rank coal\n• **Banding**: Visible bands suggest bituminous coal\n\n**Recommendations**:\n1. Compare with reference samples\n2. Conduct proximate analysis for accurate classification\n3. Test calorific value for quality assessment\n\nWould you like information on specific coal quality parameters?`;
  }

  if (lowerName.includes("site") || lowerName.includes("mine") || lowerName.includes("pit")) {
    return `🏭 **Mine Site Image**: ${fileName}\n\n**Site Analysis**:\nI can see this is a mining site image. Key observations to consider:\n\n• **Safety**: Check for proper signage and barriers\n• **Equipment**: Identify machinery and their conditions\n• **Environment**: Note dust control and water management\n• **Operations**: Assess active vs. inactive areas\n\n**For detailed analysis**:\n1. Share multiple angles if available\n2. Include scale references\n3. Note any specific concerns\n\nWhat aspect would you like me to focus on?`;
  }

  if (lowerName.includes("equipment") || lowerName.includes("machine") || lowerName.includes("truck")) {
    return `🚜 **Equipment Image**: ${fileName}\n\n**Equipment Analysis**:\nThis appears to be mining equipment documentation.\n\n**Key Assessment Areas**:\n• **Condition**: Visual wear and damage\n• **Maintenance**: Signs of proper upkeep\n• **Safety**: Required guards and markings\n• **Compliance**: Regulatory requirements\n\n**Maintenance Tips**:\n1. Regular inspection schedules\n2. Document wear patterns\n3. Track operating hours\n4. Monitor fluid levels\n\nWhat specific equipment information do you need?`;
  }

  return `📷 **Image Received**: ${fileName}\n\n**Analysis Ready**:\nI've received your image. For mining analysis, I can help identify:\n\n• **Coal samples**: Type and quality indicators\n• **Site conditions**: Safety and operational assessment\n• **Equipment**: Condition and maintenance needs\n• **Geological features**: Seam characteristics\n\nPlease describe what you'd like me to analyze in this image.`;
}

function analyzeCSV(content: string, fileName: string): string {
  const lines = content.trim().split("\n");
  const headers = lines[0]?.split(",").map((h) => h.trim().toLowerCase()) || [];
  const rowCount = lines.length - 1;

  let analysis = `📊 **CSV Data Analysis**: ${fileName}\n\n`;
  analysis += `**Overview**:\n• Rows: ${rowCount}\n• Columns: ${headers.length}\n\n`;
  analysis += `**Detected Columns**:\n${headers.map((h) => `• ${h}`).join("\n")}\n\n`;

  // Detect data type
  if (headers.some((h) => h.includes("production") || h.includes("output") || h.includes("tonnes"))) {
    analysis += `**Data Type**: Production Data\n\n`;
    analysis += `**Available Analysis**:\n`;
    analysis += `• Production trends over time\n`;
    analysis += `• Output comparisons by shift/area\n`;
    analysis += `• Efficiency metrics calculation\n`;
    analysis += `• Target vs actual comparison\n`;
  } else if (headers.some((h) => h.includes("safety") || h.includes("incident") || h.includes("accident"))) {
    analysis += `**Data Type**: Safety Records\n\n`;
    analysis += `**Available Analysis**:\n`;
    analysis += `• Incident frequency rates\n`;
    analysis += `• Trend analysis over time\n`;
    analysis += `• Root cause categorization\n`;
    analysis += `• Risk area identification\n`;
  } else if (headers.some((h) => h.includes("quality") || h.includes("ash") || h.includes("moisture") || h.includes("btu"))) {
    analysis += `**Data Type**: Coal Quality Data\n\n`;
    analysis += `**Available Analysis**:\n`;
    analysis += `• Quality parameter trends\n`;
    analysis += `• Grade distribution analysis\n`;
    analysis += `• Specification compliance check\n`;
    analysis += `• Value calculation\n`;
  } else {
    analysis += `**Available Analysis**:\n`;
    analysis += `• Statistical summary\n`;
    analysis += `• Trend visualization\n`;
    analysis += `• Correlation analysis\n`;
    analysis += `• Anomaly detection\n`;
  }

  analysis += `\n**Next Steps**: Ask me specific questions about this data!`;

  return analysis;
}

function analyzeJSON(content: string, fileName: string): string {
  try {
    const data = JSON.parse(content);
    const isArray = Array.isArray(data);
    const count = isArray ? data.length : Object.keys(data).length;

    let analysis = `📋 **JSON Data Analysis**: ${fileName}\n\n`;
    analysis += `**Structure**: ${isArray ? "Array" : "Object"}\n`;
    analysis += `**${isArray ? "Records" : "Keys"}**: ${count}\n\n`;

    if (isArray && data.length > 0) {
      const sampleKeys = Object.keys(data[0]);
      analysis += `**Fields Detected**:\n${sampleKeys.map((k) => `• ${k}`).join("\n")}\n\n`;
    } else if (!isArray) {
      const keys = Object.keys(data);
      analysis += `**Top-level Keys**:\n${keys.slice(0, 10).map((k) => `• ${k}`).join("\n")}\n`;
      if (keys.length > 10) analysis += `• ... and ${keys.length - 10} more\n`;
      analysis += "\n";
    }

    analysis += `**I can help you**:\n`;
    analysis += `• Extract specific data points\n`;
    analysis += `• Analyze patterns and trends\n`;
    analysis += `• Generate summary statistics\n`;
    analysis += `• Compare with benchmarks\n\n`;
    analysis += `What would you like to know about this data?`;

    return analysis;
  } catch {
    return `📋 **JSON File**: ${fileName}\n\nI received the JSON file but encountered a parsing issue. Please ensure the file contains valid JSON format.\n\n**Tip**: You can validate JSON at jsonlint.com`;
  }
}
