'use client'

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";


type MediaUploadProps = {
    image: any;
    setImage: React.Dispatch<any>
    onValueChange: (value: string) => void
    publicId: string
    type: string
}


const MediaUploader = ({setImage,image,onValueChange,type, publicId}: MediaUploadProps) => {

    const { toast } = useToast()
     
    const handleSuccessUpload = (result: any) => {
        setImage((prev: any) => ({
            ...prev,
            publicId: result.info?.public_id,
            secureUrl: result.info?.secure_url,
            height: result.info?.height,
            width: result.info?.width

        }))

         onValueChange(result.info?.public_id)

        toast({
            title: "Image uploaded succefully",
            description: "1 credit deducted from your account",
            className: "success-toast",
            duration: 5000
        })

    }

    const handleErrorUpload = () => {
        toast({
            title: "Something went wrong while uploading",
            description: "Please try again.",
            className: "error-toast",
            duration: 5000
        })
    }

    return (
        <div >
            <CldUploadWidget
                uploadPreset="try_imaginify"
                options={{
                    multiple: false,
                    resourceType: "image"
                }}
                onSuccess={handleSuccessUpload}
                onError={handleErrorUpload}
            >
                {({ open }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <h3 className="h3-bold text-dark-600">
                                Original
                            </h3>

                            {publicId ?
                                <>
                                    <div className="cursor-pointer overflow-hidden rounded[10px]">
                                        <CldImage
                                            width={getImageSize(type, image, "width")}
                                            height={getImageSize(type, image, "height")}
                                            src={publicId}
                                            alt="image"
                                            placeholder={dataUrl as PlaceholderValue}
                                            className="media-uploader_cldImage"
                                        />
                                    </div>
                                </>
                                :
                                <div className="media-uploader_cta" onClick={() => open()}>
                                    <div className="media-uploader_cta-image">
                                        <Image
                                            src={"/assets/icons/add.svg"}
                                            alt="Add Image"
                                            width={24}
                                            height={24} />
                                    </div>
                                    <p className="p-14-medium">Click here to upload image</p>
                                </div>
                            }
                        </div>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default MediaUploader;
