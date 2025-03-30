import { HfInference } from "@huggingface/inference";

const generateImageFromText = async (
  prompt: Record<string, string | number>,
) => {
  const hfInference = new HfInference(process.env.HUGGING_FACE_TOKEN);

  const model = "stability-ai/stable-diffusion-xl-base-1.0";

  let image;
  try {
    image = await hfInference.textToImage({
      model,
      inputs: prompt.prompt as string,
    });
  } catch (error) {
    throw new Error(error as string);
  }

  return image;
};

export default generateImageFromText;
