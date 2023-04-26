import React, { useState } from "react";

interface ImageData {
  data: {
    url: string;
  }[];
}

function ImageGenerator(): JSX.Element {
  const [imageURL, setImageURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateImage = async (keywords: string): Promise<void> => {
    setIsLoading(true);
    const response = await fetch(
      "https://api.openai.com/v1/images/generations/dalle-2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          model: "image-alpha-001",
          prompt: keywords,
          num_images: 1,
          size: "256x256",
          response_format: "url",
        }),
      }
    );

    const data: ImageData = await response.json();
    setImageURL(data.data[0].url);
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const keywords = event.currentTarget.elements.keywords.value;
    generateImage(keywords);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full mx-auto sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="keywords"
              className="block text-gray-700 font-bold mb-2"
            >
              Keywords
            </label>
            <input
              type="text"
              name="keywords"
              id="keywords"
              placeholder="Enter keywords"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </form>

        {imageURL && (
          <div className="mt-6">
            <img
              src={imageURL}
              alt="Generated image"
              className="mx-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGenerator;
