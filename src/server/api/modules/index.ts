import generateImageFromText from "./generateImageFromText";

const useModule = async (
  moduleType: string,
  prompt: Record<string, string | number>,
) => {
  try {
    switch (moduleType) {
      // Generate image with prompt
      case "c89c4301-ff03-4cc3-a254-04d7bfdae7a1":
        const res = await generateImageFromText(prompt);

        return res;
    }
  } catch (error) {
    throw new Error(error as string);
  }
};

export default useModule;
