import { type ChangeEvent } from "react";

const FileUpload = ({ files }: { files: string[] }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 ">
      <label> Files:</label>
      {files &&
        files?.map((file) => (
          <div
            key={file}
            className="flex items-center justify-between rounded-md bg-white  text-black"
          >
            <div className="rounded-md p-4 shadow-xl"> {file} Uploaded</div>
          </div>
        ))}
    </div>
  );
};

export const AddFile = ({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) => {
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  return (
    <div className="flex flex-col">
      <label htmlFor="file">Upload File:</label>
      <input
        className="rounded-md p-2 text-black focus:outline-none "
        type="file"
        accept="application/pdf"
        name="file"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileUpload;
