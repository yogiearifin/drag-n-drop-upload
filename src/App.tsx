import React, { useState } from "react";
import "./App.css";

function App() {
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [fileInfos, setFileInfos] = useState<File[]>([]);

  const checkIsFileValid = (file: Blob) => {
    return file.type.includes("image") ? true : false;
  };

  const isDisabled = previewImage.length >= 5;

  const handleMultipleImages = (file: FileList | null) => {
    console.log("file", file);
    if (file) {
      const dupes = Array.from(file)
        .map((item: File) =>
          fileInfos.filter((items: File) => items.name === item.name)
        )
        .flat();
      const targetFiles: File[] = Array.from(file);
      const selectedFiles: any = [];
      const filteredItem = targetFiles.filter(
        (item: File) => item.size < 2000000 && checkIsFileValid(item)
      );
      if (dupes.length) {
        alert("terdapat duplikat!");
      } else if (previewImage.length + filteredItem.length > 5) {
        alert("maximal 5 file!");
      } else if (
        Array.from(file).filter((item: File) => item.size > 2000000).length
      ) {
        alert("terdapat file dengan ukuran gambar lebih dari 2MB!");
      } else if (filteredItem.length === targetFiles.length) {
        filteredItem.map((file: any) => {
          return selectedFiles.push(URL.createObjectURL(file));
        });
        setPreviewImage([...previewImage, ...selectedFiles]);
        setFileInfos([...fileInfos, filteredItem].flat());
      } else {
        alert("terdapat file yang tidak valid");
      }
    }
  };
  console.log("info", fileInfos);
  console.log("preview", previewImage);

  const handleDeleteImages = (index: number, name: string) => {
    setPreviewImage(previewImage.filter((item: string) => item !== name));
    setFileInfos(fileInfos.filter((item: File) => item !== fileInfos[index]));
  };

  return (
    <div
      className="App flex column"
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleMultipleImages(e.dataTransfer.files);
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
      }}
    >
      <div className="file-upload-container">
        <p>Drop you images here</p>
        <label
          htmlFor="file-upload"
          className={
            isDisabled ? "file-upload-label-disabled" : "file-upload-label"
          }
        >
          or click here
        </label>
        <input
          id="file-upload"
          className="file-upload"
          type="file"
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleMultipleImages(e.target.files)
          }
          onClick={(e: React.MouseEvent<HTMLInputElement>) =>
            (e.currentTarget.value = "")
          }
          disabled={isDisabled}
          accept="image/*"
        />
      </div>
      <div className="App flex">
        {previewImage.length
          ? previewImage.map((item, index) => {
              return (
                <div key={index} className="preview-images-section">
                  <div className="flex preview-image-container">
                    <img
                      className="preview-image"
                      src={item}
                      alt={`preview ${index + 1}`}
                    />
                    <span
                      className="preview-image-delete"
                      onClick={() => {
                        handleDeleteImages(index, item);
                      }}
                    >
                      X
                    </span>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default App;
