import React, { useState } from "react";
import "./App.css";

function App() {
  const [previewImage, setPreviewImage] = useState<string[]>([]); 
  // state untuk menerima preview image
  const [fileInfos, setFileInfos] = useState<File[]>([]); 
  // state untuk menerima data File yang dimana terdapat attribute seperti name, size, dll

  const checkIsFileValid = (file: Blob) => {
    return file.type.includes("image") ? true : false;
  }; // fungsi untuk mengecek apakah file yang dipilih merupakan file image atau bukan

  const isDisabled = previewImage.length >= 5; 
  // kondisi untuk disable file jika sudah ada 5 file

  // fungsi untuk menghandle file baik lewat drag and drop atau label upload
  const handleMultipleImages = (file: FileList | null) => {
    if (file) {
      // mengecek apakah ada file duplikat
      const dupes = Array.from(file)
        .map((item: File) =>
          fileInfos.filter((items: File) => items.name === item.name)
        )
        .flat();
      const targetFiles: File[] = Array.from(file); 
      // menjadikan file yang dipilih sebagai array
      const selectedFiles: any = []; // array untuk menyimpan file yang valid
      const filteredItem = targetFiles.filter(
        (item: File) => item.size < 2000000 && checkIsFileValid(item)
      ); 
      // memfilter array file yang telah dipilih dengan kondisi ukuran dibawah 2MB
      // dan merupakan file gambar yang valid
      if (dupes.length) {
        alert("terdapat duplikat!");
        // memunculkan alert apabila ada duplikat file
      } else if (previewImage.length + filteredItem.length > 5) {
        alert("maximal 5 file!");
        // memunculkan alert apabila file yang dipilih sudah ada 5
      } else if (
        Array.from(file).filter((item: File) => item.size > 2000000).length
      ) {
        alert("terdapat file dengan ukuran gambar lebih dari 2MB!");
        // memunculkan alert apabila terdapat file dengan ukurang lebih dari 2MB
      } else if (filteredItem.length === targetFiles.length) {
        filteredItem.map((file: any) => {
          return selectedFiles.push(URL.createObjectURL(file));
        });
        // apabila tidak ada masalah, maka file yang dipilih akan masuk ke array selectedFiles
        setPreviewImage([...previewImage, ...selectedFiles]);
        setFileInfos([...fileInfos, filteredItem].flat());
        // memasukan konten isi selectedFiles ke dalam 
        // state untuk preview image dan state file info
      } else {
        alert("terdapat file yang tidak valid");
        // alert yang muncul apabila ada file yang bukan image atau tidak valid
      }
    }
  };

  const handleDeleteImages = (index: number, name: string) => {
    setPreviewImage(previewImage.filter((item: string) => item !== name));
    setFileInfos(fileInfos.filter((item: File) => item !== fileInfos[index]));
  };
  // fungsi untuk menghapus gambar

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
      // fungsi drag and drop
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
        {/* preview gambar yang telah dipilih  */}
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
