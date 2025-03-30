import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import uploadImage from "@/lib/uploadImage";

export const imageRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        image: z.string(),
        filename: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const base64Data = input.image.split(",")[1];
        if (!base64Data) {
          throw new Error("Invalid image data");
        }
        const buffer = Buffer.from(base64Data, "base64");
        const imageUrl = await uploadImage(buffer, input.filename);
        return { imageUrl };
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
      }
    }),
});
