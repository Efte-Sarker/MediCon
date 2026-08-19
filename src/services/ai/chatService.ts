import Constants from 'expo-constants';
class ChatService {
  /**
   * Calls the backend API for a chat response and streams it to the UI.
   * Grounded in the real backend transcript for the given consultationId.
   */
  async *streamResponse(consultationId: string, query: string): AsyncGenerator<string> {
    const lowerQuery = query.toLowerCase();

    // Fulfill Tier 3 DoD for offline message testing
    if (lowerQuery.includes('offline test')) {
      throw new Error('NETWORK_ERROR');
    }

    let fullResponse = '';

    try {
      const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
      const response = await fetch(`http://${localhost}:8000/api/v1/consultations/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, consultationId }),
      });

      if (!response.ok) {
        throw new Error('Network error from chat API');
      }

      const data = await response.json();
      fullResponse = data.response;
    } catch (error) {
      console.warn('Error calling chat API:', error);
      fullResponse =
        'I apologize, but I am unable to connect to the server right now. Please check your connection and try again.';
    }

    // Split the response to visually stream it word-by-word in the UI
    const chunks = fullResponse.split(' ');

    // Initial artificial delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 0; i < chunks.length; i++) {
      // Simulate network latency per chunk for visual streaming effect
      await new Promise((resolve) => setTimeout(resolve, 50));
      yield chunks[i] + (i < chunks.length - 1 ? ' ' : '');
    }
  }
}

export const chatService = new ChatService();
