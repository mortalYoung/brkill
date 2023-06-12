// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import TreeDataProviderClass from "./TreeViewProvider";
import { deleteBranch, getRawName } from "./utils";
import TreeDataItem from "./TreeItem";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-plugin-brkill" is now active!');

  const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

  const treeData = new TreeDataProviderClass(rootPath);
  vscode.window.registerTreeDataProvider("brkill-item", treeData);

  vscode.commands.registerCommand("vscode-plugin-brkill.refreshEntry", () => treeData.refresh());

  context.subscriptions.push(
    vscode.commands.registerCommand("itemClick", (treeItem: TreeDataItem) => {
      if (treeItem.rawLabel.startsWith("*")) {
        vscode.window.showWarningMessage(`You can't delete current branch`);
        return;
      }

      if (treeItem.status === undefined) {
        treeData.updateTreeData(treeItem, 0);
        deleteBranch(treeItem.rawLabel, rootPath, false)
          .then(() => {
            treeData.updateTreeData(treeItem, 1);
          })
          .catch((err) => {
            treeData.updateTreeData(treeItem, 2);
            vscode.window.showErrorMessage(`${err}, click it again to force delete it.`);
          });
      }

      if (treeItem.status === 0 || treeItem.status === 1) {
        // do nothing
      }

      if (treeItem.status === 2) {
        treeData.updateTreeData(treeItem, 0);
        deleteBranch(treeItem.rawLabel, rootPath, true)
          .then(() => {
            treeData.updateTreeData(treeItem, 1);
          })
          .catch((err) => {
            treeData.updateTreeData(treeItem, 2);
            vscode.window.showErrorMessage(`${err}, click it again to force delete it.`);
          });
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
