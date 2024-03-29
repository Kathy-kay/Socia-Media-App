import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { postFormSchema } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutation";


type postFormsProps = {
  post?: Models.Document;
  action: "Create" | "Update"
};

const PostForm = ({ post, action}: postFormsProps) => {
  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    if(post && action === "Update"){
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl 
      })
      if (!updatedPost) {
        toast({title: "Unable to update post, Please try again"})
      }else{
        toast({title: "Successfully update post"})
      }
      // console.log(updatedPost)
      return navigate('/')
    }
   

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newPost = await createPost({
      ...values,
      userId:user.id
    });

    if(!newPost){
      toast({title: "Please try again"})
    }
    // console.log(values)
    navigate('/')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_Label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="caption"
                  className="shad-textarea  custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_Label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_Label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Lagos"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_Label">
                Add tags (sepearted by ",")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Art, Learn, Programming"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark-4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isCreatingPost || isLoadingUpdate }
          >
          {isCreatingPost || isLoadingUpdate && "Loading..."}
          {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
