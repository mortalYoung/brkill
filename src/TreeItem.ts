import * as path from "path";
import { MarkdownString, TreeItem, Uri } from "vscode";

export enum StatusKind {
  process,
  success,
  failure,
}

export default class TreeDataItem extends TreeItem {
  public rawLabel = "";
  constructor(public label: string, public status?: StatusKind) {
    super(label);
    this.rawLabel = label;
    this.tooltip = this.rawLabel;
  }
  private statusText = ["删除中", "删除成功", "删除失败"];

  public setStatus(status?: StatusKind) {
    this.status = status;
    if (status === undefined) {
      this.label = this.rawLabel;
    } else {
      this.label = `[${this.statusText[status]}]${this.rawLabel}`;
    }

    switch (status) {
      case StatusKind.success: {
        this.iconPath = {
          light: path.join(__filename, "..", "..", "resources", "light", "check.svg"),
          dark: path.join(__filename, "..", "..", "resources", "dark", "check.svg"),
        };
        break;
      }
      case StatusKind.failure: {
        this.iconPath = {
          light: path.join(__filename, "..", "..", "resources", "light", "uncheck.svg"),
          dark: path.join(__filename, "..", "..", "resources", "dark", "uncheck.svg"),
        };
        break;
      }

      default:
        break;
    }
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "resources", "light", "dep.svg"),
    dark: path.join(__filename, "..", "..", "resources", "dark", "dep.svg"),
  };

  command = {
    title: this.label,
    command: "itemClick",
    tooltip: this.label,
    arguments: [this],
  };
}
