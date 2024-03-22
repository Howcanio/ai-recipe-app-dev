'use server';

import { s3Client } from '@/app/lib/s3Config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const bucket = process.env.S3_BUCKET as string;

export async function processImage(imageBase64Data: string, query: string) {
  try {
    const imageBuffer = Buffer.from(imageBase64Data, 'base64');
    const fileName = `${query}-${Date.now()}`;
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('Image created and stored in S3 successfully.');
    return fileName;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

async function streamToString(stream: any): Promise<string> {
  if (!stream) {
    return '';
  }

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

function normalizeIngredientName(name: string) {
  return name.trim().toLowerCase().replace(/s$/, '');
}

export async function parseIngredientsCsv(): Promise<IngredientUrl[]> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: 'ingredients.csv',
    });

    const { Body } = await s3Client.send(command);

    // Convert the Body stream to a string
    const csvContent = await streamToString(Body);

    // Split the CSV content into lines and skip the header
    const lines = csvContent.trim().split('\n').slice(1);

    const ingredientsJson = lines.reduce(
      (acc: IngredientUrl[], line): IngredientUrl[] => {
        const splitIndex = line.indexOf(',"<a');
        if (splitIndex === -1) {
          return acc; // Skip this line
        }

        const ingredientRaw = line.substring(0, splitIndex);
        const htmlRaw = line.substring(splitIndex + 1);

        const ingredient = ingredientRaw
          .trim()
          .replace(/^"|"$/g, '')
          .toLowerCase();

        const htmlMatch = htmlRaw ? htmlRaw.match(/href=""([^"]+)""/) : null;
        const url = htmlMatch ? htmlMatch[1] : null;

        acc.push({ [ingredient]: url });
        return acc;
      },
      []
    );

    return ingredientsJson;
  } catch (err) {
    console.error('Error processing the CSV file from S3:', err);
    throw err;
  }
}

export async function appendIngredientsToCSV(ingredients: string[]) {
  try {
    const getObjectParams = {
      Bucket: bucket,
      Key: 'ingredients.csv',
    };

    // Fetch the existing CSV content from S3
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
    const data = await streamToString(Body);

    // Parse existing ingredients and normalize
    const existingIngredients = data.split('\n').map((line) => {
      const [ingredientName] = line.split(',');
      return normalizeIngredientName(ingredientName);
    });

    // Normalize and filter new ingredients
    const ingredientsToAppend = ingredients.filter(
      (ingredient) =>
        !existingIngredients.includes(normalizeIngredientName(ingredient))
    );

    // Convert the list of new, unique ingredients to CSV format
    const ingredientsCSV = ingredientsToAppend
      .map((ingredient) => `${ingredient},\n`)
      .join('');

    // Append and write back to the CSV if there are new ingredients
    console.log('Ingredients to append', ingredientsToAppend);

    if (ingredientsToAppend.length > 0) {
      const updatedCSVContent = data + ingredientsCSV;
      console.log('Updated CSV content', updatedCSVContent);
      const putObjectParams = {
        Bucket: bucket,
        Key: 'ingredients.csv',
        Body: updatedCSVContent,
        ContentType: 'text/csv',
      };
      await s3Client.send(new PutObjectCommand(putObjectParams));
      console.log(
        'New ingredients have been successfully appended to the CSV file.'
      );
    } else {
      console.log('No new ingredients to add.');
    }
  } catch (err) {
    console.error('Error processing the CSV file from S3:', err);
  }
}
