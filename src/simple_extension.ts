import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Python-JS Highlighter is now active');

    let disposable = vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'python' },
        new PythonJSSemanticTokensProvider(),
        new vscode.SemanticTokensLegend(['comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
            'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
            'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label']
        )
    );

    context.subscriptions.push(disposable);
}

class PythonJSSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder();
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            if (line.text.trim().startsWith('#js')) {
                // JavaScript block starts
                i++;
                while (i < document.lineCount) {
                    const jsLine = document.lineAt(i);
                    if (jsLine.text.trim().startsWith('#end-js')) {
                        break;
                    }
                    this.highlightJavaScript(jsLine, builder);
                    i++;
                }
            }
        }
        return builder.build();
    }

    private highlightJavaScript(line: vscode.TextLine, builder: vscode.SemanticTokensBuilder) {
        // This is a simplified version. You'd need more complex parsing for full JS highlighting
        const jsKeywords = ['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while'];
        const words = line.text.split(/\b/);
        let charIndex = 0;
        for (const word of words) {
            if (jsKeywords.includes(word)) {
                builder.push(line.lineNumber, charIndex, word.length, 2); // 2 is the index for 'keyword'
            }
            charIndex += word.length;
        }
    }
}

export function deactivate() {}