import React, { useState, useEffect } from "react";
import ImagE from "./Image";
import { ImageStyle, ImageType, Size } from "../helpers/compInterface";

const ProfilePicker = () => {
    const [activeImage, setActiveImage] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<{ name: string; file: File; url: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const imagePaths = [
        { name: "saban.jfif", path: "/dump/saban.jfif" },
        { name: "sinan.jfif", path: "/dump/sinan.jfif" },
        { name: "jasar.jfif", path: "/dump/jasar.jfif" },
        { name: "shadow.jfif", path: "/dump/shadow.jfif" }
    ];

    useEffect(() => {
        const loadImages = async () => {
            try {
                const loadedImages = await Promise.all(
                    imagePaths.map(async (image) => {
                        const response = await fetch(image.path);
                        const blob = await response.blob();
                        const file = new File([blob], image.name, { type: blob.type });
                        const url = URL.createObjectURL(file);

                        setLoading(false);
                        return { name: image.name, file, url };
                    })
                );
                setImageFiles(loadedImages);
            } catch (error) {
                console.error("Error loading images:", error);
            }
        };

        loadImages();

        return () => {
            imageFiles.forEach((image) => URL.revokeObjectURL(image.url));
        };
    }, []);

    const handleImageClick = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            localStorage.setItem("ProfilePic", base64String);
            localStorage.setItem("ProfilePicName", file.name);
            setActiveImage(file);
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return <></>;
    }

    return (
        <span>
            {imageFiles.map((image) => (
                <ImagE
                    key={image.name}
                    type={ImageType.BTN}
                    style={activeImage && activeImage.name === image.name ? ImageStyle.PICKED : ImageStyle.PICK}
                    size={Size.SMALL}
                    action={() => handleImageClick(image.file)}
                    loading="eager"
                    src={image.url}
                />
            ))}
        </span>
    );
};

export default ProfilePicker;