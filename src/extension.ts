import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Python-JS Highlighter is now active');

    let disposable = vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'python' },
        new PythonJSSemanticTokensProvider(),
        new vscode.SemanticTokensLegend([
            'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
            'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
            'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
        ])
    );

    context.subscriptions.push(disposable);
}

class PythonJSSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    private readonly tokenTypes = new Map<string, number>([
        ['comment', 0],
        ['string', 1],
        ['keyword', 2],
        ['number', 3],
        ['regexp', 4],
        ['operator', 5],
        ['namespace', 6],
        ['type', 7],
        ['struct', 8],
        ['class', 9],
        ['interface', 10],
        ['enum', 11],
        ['typeParameter', 12],
        ['function', 13],
        ['method', 14],
        ['decorator', 15],
        ['macro', 16],
        ['variable', 17],
        ['parameter', 18],
        ['property', 19],
        ['label', 20]
    ]);

    private readonly tokenModifiers = new Map<string, number>([
        ['declaration', 0],
        ['definition', 1],
        ['readonly', 2],
        ['static', 3],
        ['deprecated', 4],
        ['abstract', 5],
        ['async', 6],
        ['modification', 7],
        ['documentation', 8],
        ['defaultLibrary', 9]
    ]);

    private readonly jsLegend = new vscode.SemanticTokensLegend(
        [...this.tokenTypes.keys()],
        [...this.tokenModifiers.keys()]
    );

    async provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder(this.jsLegend);
        let inJsBlock = false;

        for (let i = 1; i < document.lineCount-1; i++) {
            const line = document.lineAt(i);
            const prevline = document.lineAt(i - 1);
            const nextline = document.lineAt(i + 1);
            
            if (prevline.text.trim().startsWith('#js')) { // skip first line after comment, usually """
                inJsBlock = true;
                continue;
            }

            if ((nextline.text.trim().startsWith('#end-js')) || (line.text.trim().startsWith('"""'))) {
                inJsBlock = false;
                continue;
            }

            if (inJsBlock) {
                this.highlightJavaScript(line, builder);
            }
        }

        return builder.build();
    }

    private highlightJavaScript(line: vscode.TextLine, builder: vscode.SemanticTokensBuilder) {
        const text = line.text;
        let match: RegExpExecArray | null;

        // Keywords
        const keywords = /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|typeof|instanceof|this)\b/g;
        while ((match = keywords.exec(text)) !== null) {
            builder.push(line.lineNumber, match.index, match[0].length, this.tokenTypes.get('keyword')!);
        }

        // Strings
        const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
        while ((match = strings.exec(text)) !== null) {
            builder.push(line.lineNumber, match.index, match[0].length, this.tokenTypes.get('string')!);
        }

        // Numbers
        const numbers = /\b-?\d+(\.\d+)?\b/g;
        while ((match = numbers.exec(text)) !== null) {
            builder.push(line.lineNumber, match.index, match[0].length, this.tokenTypes.get('number')!);
        }

        // Functions
        const functions = /\b([a-zA-Z_$][\w$]*)\s*\(/g;
        while ((match = functions.exec(text)) !== null) {
            builder.push(line.lineNumber, match.index, match[1].length, this.tokenTypes.get('function')!);
        }

        // Comments
        const comments = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm;
        while ((match = comments.exec(text)) !== null) {
            builder.push(line.lineNumber, match.index, match[0].length, this.tokenTypes.get('comment')!);
        }
    }
}

export function deactivate() {}