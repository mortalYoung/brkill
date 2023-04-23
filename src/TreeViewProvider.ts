import {
  TreeItem,
  TreeItemCollapsibleState,
  TreeDataProvider,
  Event,
  ProviderResult,
  workspace,
  CancellationToken,
  EventEmitter,
  Uri,
} from "vscode";
import { getLocalBranchList } from "./utils";
import TreeDataItem, { StatusKind } from "./TreeItem";

type EventNode = void | TreeDataItem | TreeDataItem[] | null | undefined;

export default class TreeDataProviderClass
  implements TreeDataProvider<TreeDataItem>
{
  private _onDidChangeTreeData = new EventEmitter<EventNode>();
  onDidChangeTreeData: Event<EventNode> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {}

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeDataItem): TreeDataItem | Thenable<TreeDataItem> {
    return element;
  }

  getChildren(): ProviderResult<TreeDataItem[]> {
    return getLocalBranchList(this.workspaceRoot).map((i) => {
      const treeItem = new TreeDataItem(i);
      return treeItem;
    });
  }

  updateTreeData(treeItem: TreeDataItem, status: StatusKind) {
    treeItem.setStatus(status);
    this._onDidChangeTreeData.fire(treeItem);
  }
}
