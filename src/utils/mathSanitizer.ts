export function sanitizeMathMarkdown(text: string): string {
  if (!text) return "";
  return text
    // Replace raw /$ or \$ or \$ with clean format
    .replace(/\\\$|\/\$|\$/g, "")
    // Clean up common LaTeX commands into clean unicode characters for crystal clear readability
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\theta/g, "θ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\pi/g, "π")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\omega/g, "ω")
    .replace(/\\infty/g, "∞")
    .replace(/\\pm/g, "±")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "·")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\to/g, "→")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\leftarrow/g, "←")
    .replace(/\\Rightarrow/g, "⇒")
    .replace(/\\in/g, "∈")
    .replace(/\\subset/g, "⊂")
    .replace(/\\int/g, "∫")
    .replace(/\\sum/g, "∑")
    .replace(/\\partial/g, "∂")
    .replace(/\\vec\{([^}]+)\}/g, "$1⃗");
}
