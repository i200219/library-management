"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
    throw new Error('Authentication request failed: Unknown error occurred');
  }
};

interface UploadResponse {
  filePath: string;
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size?: number;
}

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
    progress: "h-2 bg-green-500 text-center text-xs text-white font-semibold",
  };

  const onError = (error: unknown) => {
    console.error("Upload error:", error);
    
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
      setError(error.message);
    } else {
      errorMessage = String(error);
      setError(String(error));
    }

    toast({
      title: `${type} upload failed`,
      description: errorMessage || `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = async (res: UploadResponse) => {
    try {
      setFile(res);
      onFileChange(res.filePath);
      setError(null);

      toast({
        title: `${type} uploaded successfully`,
        description: `${res.filePath} uploaded successfully!`,
      });
    } catch (error) {
      onError(error);
    }
  };

  const onValidate = (file: File) => {
    const maxSize = type === "image" ? 20 * 1024 * 1024 : 50 * 1024 * 1024;
    const sizeLimit = type === "image" ? "20MB" : "50MB";

    if (file.size > maxSize) {
      toast({
        title: "File size too large",
        description: `Please upload a file that is less than ${sizeLimit} in size`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const uploadRef = ikUploadRef.current;
      if (uploadRef) {
        uploadRef.click();
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => {
          setProgress(0);
          setError(null);
        }}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        className={cn(
          "upload-btn",
          styles.button,
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isLoading && "disabled"
        )}
        onClick={handleClick}
        disabled={isLoading}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className={cn(styles.progress, "text-center text-xs font-semibold")} style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file && !error && (
        type === "image" ? (
          <IKImage
            alt={file.filePath || "Uploaded image"}
            path={file.filePath || undefined}
            width={500}
            height={300}
            className="mt-4"
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath || undefined}
            controls={true}
            className="w-full h-96 m-4 rounded-xl"
            />
        ) : null
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
