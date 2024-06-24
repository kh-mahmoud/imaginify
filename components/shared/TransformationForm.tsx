"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TransformationFormProps, Transformations } from "@/types"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import CustomeField from "./CustomeField"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { Button } from "../ui/button"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { redirect, useRouter } from "next/navigation"
import { InsufficientCreditsModal } from "./insufficientcredits"
import { updateCredits } from "@/lib/actions/user.actions"


//schema validation
export const formSchema = z.object({
    title: z.string().min(2).max(50),
    aspectRatio: z.string().nullable(),
    color: z.string().nullable(),
    prompt: z.string().nullable(),
    publicId: z.string()
})


const TransformationForm = ({ action, data = null, userId, type, config = null, creditBalance }: TransformationFormProps) => {

    const [image, setImage] = useState(data)
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isTransforming, setIsTransforming] = useState(false)
    const transformationType = transformationTypes[type]
    const [isPending, startTransition] = useTransition()
    const [credit, setCredit] = useState(false)


    const router = useRouter()



    const InitialValue = data && action == 'Update' ?
        {
            title: data?.title,
            aspectRatio: data?.aspectRatio,
            color: data?.color,
            prompt: data?.prompt,
            publicId: data?.publicId
        } : defaultValues

    // forme initial values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: InitialValue
    })


    const SelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imagesize = aspectRatioOptions[value as AspectRatioKey]

        setImage((prev: any) => ({
            ...prev,
            aspectRatio: imagesize.aspectRatio,
            height: imagesize.height,
            width: imagesize.width,

        }))

        setNewTransformation(transformationType.config)

        return onChangeField(value)

    }


    const transformHandler = () => {

        if (creditBalance < Math.abs(creditFee)) {
            
            setCredit(true)
        }
        else {

            setIsTransforming(true)

            setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))

            setNewTransformation(null)

            startTransition(async () => {
                await updateCredits(userId, creditFee)
            })
        }


    }


    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
        debounce(() => {
            setNewTransformation((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
            }))
        }, 1000)();

        return onChangeField(value)
    }

    // submit function
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsSubmiting(true)

        if (!image) throw new Error("upload image ")


        const transformationUrl = getCldImageUrl({

            width: image?.width,
            height: image?.height,
            src: image?.publicId,
            ...transformationConfig
        })

        const imageData = {
            title: values.title,
            publicId: image?.publicId,
            transformationType: type,
            width: image?.width,
            height: image?.height,
            config: transformationConfig,
            secureUrl: image?.secureUrl,
            transformationUrl: transformationUrl,
            aspectRatio: values.aspectRatio,
            prompt: values.prompt,
            color: values.color,
        }

        if (action == "Add") {
            try {

                const newImage = await addImage({
                    image: imageData,
                    userId,
                    path: "/"
                })

                if (newImage) {
                    form.reset()
                    setImage(data)
                    router.push(`/transformations/${newImage.id}`)
                }
                setIsSubmiting(false)

            } catch (error) {
                console.log(error)
                setIsSubmiting(false)
            }
        }

        if (action === 'Update') {
            try {
                if (!data) redirect('/')

                const updatedImage = await updateImage({
                    image: {
                        ...imageData,
                        id: data.id
                    },
                    userId,
                    path: `/transformations/${data?.id}`
                })

                if (updatedImage) {
                    router.push(`/transformations/${updatedImage.id}`)
                }
            } catch (error) {
                console.log(error);
            }
        }




    }

    useEffect(() => {
        if (image && (type === 'restore' || type === 'removeBackground')) {
            setNewTransformation(transformationType.config)
        }

    }, [image, transformationType.config, type])

    return (
        <div className="mt-10">
            <Form {...form}>
                {credit && <InsufficientCreditsModal />}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <CustomeField
                        control={form.control}
                        name='title'
                        formLabel="Image Title"
                        className="w-full"
                        render={({ field }) => <Input value={field.value} {...field} />}
                    />


                    {type === 'fill' && (
                        <CustomeField
                            control={form.control}
                            name="aspectRatio"
                            formLabel="Aspect Ratio"
                            className="w-full"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => SelectFieldHandler(value, field.onChange)}
                                    value={field.value}
                                >
                                    <SelectTrigger className="select-field">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(aspectRatioOptions).map((key) => (
                                            <SelectItem key={key} value={key} className="select-item">
                                                {aspectRatioOptions[key as AspectRatioKey].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}

                    {(type == "remove" || type === "recolor") &&
                        (
                            <div >
                                <CustomeField
                                    control={form.control}
                                    name="prompt"
                                    formLabel={
                                        type === 'remove' ? 'Object to remove' : 'Object to recolor'
                                    }
                                    className="w-full"
                                    render={({ field }) => (
                                        <Input
                                            value={field.value}
                                            className="input-field"
                                            onChange={(e) => onInputChangeHandler(
                                                'prompt',
                                                e.target.value,
                                                type,
                                                field.onChange
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        )}

                    {(type === "recolor") &&
                        (
                            <div className="">
                                <CustomeField
                                    control={form.control}
                                    name="color"
                                    formLabel="Replacement Color"
                                    className="w-full"
                                    render={({ field }) => (
                                        <Input
                                            value={field.value}
                                            className="input-field"
                                            onChange={(e) => onInputChangeHandler(
                                                'color',
                                                e.target.value,
                                                'recolor',
                                                field.onChange
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        )}

                    <div className="media-uploader-field ">
                        <CustomeField
                            control={form.control}
                            name='publicId'
                            className="flex flex-col size-full "
                            render={({ field }) => <MediaUploader setImage={setImage} image={image} onValueChange={field.onChange} type={type} publicId={field.value} />}
                        />

                        <TransformedImage
                            image={image}
                            type={type}
                            title={form.getValues().title}
                            isTransforming={isTransforming}
                            setIsTransforming={setIsTransforming}
                            transformationConfig={transformationConfig}
                        />


                    </div>

                    <div className="flex flex-col gap-4">

                        <Button disabled={isTransforming || newTransformation === null} onClick={transformHandler} type="button" className={"submit-button capitalize"}>{isTransforming ? "Transforming..." : "Apply Transformation"}</Button>

                        <Button disabled={isSubmiting} type="submit" className={"submit-button capitalize"}>{isSubmiting ? "Saving..." : "Save Image"}</Button>

                    </div>
                </form>
            </Form>
        </div>
    );
}

export default TransformationForm;
