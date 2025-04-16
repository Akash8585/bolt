export enum StepType {
  CreateFile = 'createFile',
  RunCommand = 'runCommand'
}

export interface Step {
  id?: string;
  name: string;
  description?: string;
  type: StepType;
  status?: 'pending' | 'completed' | 'failed';
  code?: string;
  path?: string;
  command?: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileItem[];
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
} 