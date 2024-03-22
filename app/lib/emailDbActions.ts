'use server';

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export const getMostPopularEmailRecipes = async (monthsAgo: number) => {
  // Calculate the target date directly in JavaScript
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - monthsAgo);

  const formattedDate = targetDate.toISOString().split('T')[0];

  try {
    const recipes = await sql`
      SELECT * FROM recipe
      WHERE 
        (last_emailed IS NULL OR last_emailed < ${formattedDate})
      ORDER BY search_count DESC
      LIMIT 3;
    `;
    console.log('Fetched most popular recipes');
    return recipes.rows;
  } catch (error) {
    console.error('Error fetching most popular recipes:', error);
    return [];
  }
};

export const getMostRecentEmailRecipes = async (monthsAgo: number) => {
  // Calculate the target date directly in JavaScript
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - monthsAgo);
  const formattedDate = targetDate.toISOString().split('T')[0];

  try {
    const recipes = await sql`
      SELECT * FROM recipe
      WHERE 
        (last_emailed IS NULL OR last_emailed < ${formattedDate})
      ORDER BY created_at DESC
      LIMIT 3;
    `;
    console.log('Fetched most recent recipes');
    return recipes.rows;
  } catch (error) {
    console.error('Error fetching most recent recipes:', error);
    return [];
  }
};

export const updateLastEmailed = async (recipeId: string) => {
  try {
    await sql`
      UPDATE recipe
      SET last_emailed = NOW()
      WHERE id = ${recipeId};
    `;

    console.log('Updated last emailed date for recipe', recipeId);
  } catch (error) {
    console.error('Error updating last emailed date:', error);
  }
};

export async function createSubscription(email: string) {
  try {
    // First, check if a subscriber with the given email already exists
    const existingSubscriber = await sql`
      SELECT * FROM newsletter_subscribers
      WHERE email = ${email};
    `;

    if (existingSubscriber.rowCount > 0) {
      // Subscriber exists
      if (!existingSubscriber.rows[0].is_active) {
        // If the subscriber exists but is not active, activate them
        await sql`
          UPDATE newsletter_subscribers
          SET is_active = TRUE
          WHERE email = ${email};
        `;
        return {
          status: 'success',
          action: 'resubscribe',
          subscriber: existingSubscriber,
          message: 'You have been resubscribed to our newsletter',
        };
      } else {
        // Subscriber already active
        return {
          status: 'success',
          action: 'no',
          subscriber: existingSubscriber,
          message: 'Email already subscribed to our newsletter',
        };
      }
    } else {
      // Subscriber does not exist, create a new one
      const unsubscribeToken = uuidv4();
      const insertedSubscriber = await sql`
    INSERT INTO newsletter_subscribers (email, unsubscribe_token) VALUES (${email}, ${unsubscribeToken}) RETURNING *;`;
      return {
        status: 'success',
        action: 'subscribe',
        subscriber: insertedSubscriber,
        message: 'You have been subscribed to our newsletter',
      };
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return {
      status: 'error',
      action: 'no',
      subscriber: null,
      message: 'An error occurred while processing your subscription',
    };
  }
}

export async function deactivateSubscriber(token: string) {
  try {
    const result = await sql`
            UPDATE newsletter_subscribers
            SET is_active = FALSE
            WHERE unsubscribe_token = ${token}
            RETURNING *;
        `;
    return {
      status: 'success',
      message: 'You are now unsubscribed from our weekly email.',
    };
  } catch (error) {
    console.error('Error deactivating subscriber:', error);
    return {
      status: 'error',
      message:
        'Error unsubscribing from our weekly email. Please try again, or contact us!',
    };
  }
}

export async function getAllActiveSubscribers() {
  try {
    const result = await sql`
      SELECT * FROM newsletter_subscribers
      WHERE is_active = TRUE;
    `;
    if (result.rowCount > 0) {
      console.log('Active subscribers found:', result.rows);
      return result.rows;
    } else {
      console.log('No active subscribers found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    return [];
  }
}

export async function getActiveSubscriberByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM newsletter_subscribers
      WHERE is_active = TRUE AND email = ${email};
    `;
    if (result.rowCount > 0) {
      console.log('Active subscriber found:', result.rows[0]);
      return result.rows[0]; // Assuming email is unique, so there's only one match
    } else {
      console.log(`No active subscriber found with email: ${email}.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching active subscriber:', error);
    return null;
  }
}

export async function getSubscriberByUnsubscribeToken(token: string) {
  try {
    const result = await sql`
      SELECT * FROM newsletter_subscribers
      WHERE unsubscribe_token = ${token};
    `;
    if (result.rowCount > 0) {
      console.log('Active subscriber found:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log(`No subscriber found with token: ${token}.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching active subscriber:', error);
    return null;
  }
}

// This needs testing
export const getCurrentEmailPopularRecipes = async () => {
  try {
    const recipes = await sql`
      SELECT * FROM recipe WHERE last_emailed = ( SELECT MAX(last_emailed) FROM recipe WHERE last_emailed <= NOW()) ORDER BY search_count DESC LIMIT 3;
    `;
    console.log('Fetched current email popular recipes');
    return recipes.rows;
  } catch (error) {
    console.error('Error fetching current email popular recipes:', error);
    return [];
  }
};
export const getCurrentEmailRecentRecipes = async () => {
  try {
    const recipes = await sql`
      SELECT * FROM recipe WHERE last_emailed = ( SELECT MAX(last_emailed) FROM recipe WHERE last_emailed <= NOW()) ORDER BY created_at DESC LIMIT 3;
    `;
    console.log('Fetched current email popular recipes');
    return recipes.rows;
  } catch (error) {
    console.error('Error fetching current email popular recipes:', error);
    return [];
  }
};
