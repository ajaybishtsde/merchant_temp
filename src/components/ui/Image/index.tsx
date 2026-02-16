// import SingleDriverDocument from "@/components/Driver/SingleDriverDocument";
import React from "react";
import { Document, Page } from "react-pdf";


interface RenderImageViewProps {
    src?: string;
    alt: string;
    notFoundMessage: string;
}
export const RenderImageView: React.FC<RenderImageViewProps> = ({ src, alt, notFoundMessage }) => {
    const [fileType, setFileType] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (src) {
            const splitUrl = src.split(".");
            const extension = splitUrl[splitUrl.length - 1].toLowerCase();
            setFileType(extension);
        }
    }, [src]);


    return (
        <React.Fragment>
            <div
                className=" border"
            >
                {fileType === "pdf" ? (
                    <div className="h-[500px] w-[500px] overflow-auto">
                        <Document file={src} >
                            <Page
                                pageNumber={1}
                                className="h-full w-full"
                                width={500} // Ensures the page fits within the given width
                                height={500}
                            />
                        </Document>
                    </div>
                ) : fileType === "jpg" || fileType === "jpeg" || fileType === "png" ? (
                    <div className="h-[550px] w-[550px] overflow-hidden flex items-center justify-center">
                        <img className="max-h-full max-w-full object-cover" src={src} alt={alt} />
                    </div>
                ) : (
                    <p>{notFoundMessage}</p>
                )}
            </div>
        </React.Fragment>

    );
};

export default RenderImageView