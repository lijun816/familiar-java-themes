const vscode = require("vscode");

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand(
		"familiarJavaThemes.configurationHelper",
		showConfigurationHelper
	));
}

const intelliJConfigurationValues = {
	// Match IDEA's font settings for the editor
	"editor.fontFamily": "'JetBrains Mono'",
	"editor.fontSize": 16,
	"editor.lineHeight": 26,
	"editor.letterSpacing": 0.5,

	// Match IDEA's font settings for the terminal
	"terminal.integrated.fontFamily": "'JetBrains Mono'",
	"terminal.integrated.fontSize": 16,
	"terminal.integrated.lineHeight": 1.25,
	"terminal.integrated.letterSpacing": 1,

	// Match IDEA's font settings for the debug console
	"debug.console.fontFamily": "'JetBrains Mono'",
	"debug.console.fontSize": 16,
	"debug.console.lineHeight": 26,

	// The editor suggest widget (autocompletion)
	// has a smaller line height in IDEA
	"editor.suggestLineHeight": 23,

	// IDEA does not draw bold ANSI text in bright colors
	"terminal.integrated.drawBoldTextInBrightColors": false,

	// IDEA shows the current line in the editor gutter
	"editor.renderLineHighlight": "all"
};

const CURRENT_VALUES = "Current Values";
const INTELLIJ_VALUES = "IntelliJ Values";
const DEFAULT_VALUES = "Default Values (Reset)";

function showConfigurationHelper() {
	const currentValues = {};
	Object.keys(intelliJConfigurationValues).forEach((key) => {
		currentValues[key] = vscode.workspace.getConfiguration(undefined, vscode.ConfigurationTarget.Global).get(key);
	});

	const onSelection = (item) => {
		switch (item) {
			case undefined:
			case CURRENT_VALUES: {
				setConfigurationValues(currentValues);
				break;
			}
			case INTELLIJ_VALUES: {
				setConfigurationValues(intelliJConfigurationValues);
				break;
			}
			case DEFAULT_VALUES: {
				setConfigurationValues({});
				break;
			}
		}
	}

	vscode.window.showQuickPick(
		[
			CURRENT_VALUES,
			INTELLIJ_VALUES,
			DEFAULT_VALUES
		],
		{
			placeHolder: "Select Configuration Values (Up/Down Keys to Preview)",
			ignoreFocusOut: true,
			onDidSelectItem: onSelection
		}
	).then(onSelection);
}

function setConfigurationValues(values) {
	Object.keys(intelliJConfigurationValues).forEach((key) => {
		vscode.workspace.getConfiguration().update(key, values[key], vscode.ConfigurationTarget.Global);
	})
}

module.exports = {
	activate
}
