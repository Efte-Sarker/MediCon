class ChatService {
  /**
   * Mocks an AI streaming response.
   * Yields text chunks to simulate a real token-by-token stream.
   * Grounded in a mock transcript for the given consultationId.
   */
  async *streamResponse(consultationId: string, query: string): AsyncGenerator<string> {
    const lowerQuery = query.toLowerCase();

    // Fulfill Tier 3 DoD for offline message testing
    if (lowerQuery.includes('offline test')) {
      throw new Error('NETWORK_ERROR');
    }

    // Mock transcript knowledge base per consultationId
    const mockTranscripts: Record<string, string> = {
      'cons-1':
        'During consultation cons-1, Dr. Sarah Khan diagnosed you with acute pharyngitis (sore throat). She prescribed Azithromycin 500mg for 3 days and advised warm salt water gargles.',
      'cons-2':
        'During consultation cons-2, Dr. Ahmed Rahman noted your blood pressure was slightly elevated. He recommended a low-sodium diet and daily 30-minute walks, and scheduled a follow-up in one month.',
    };

    const transcriptContext =
      mockTranscripts[consultationId] || 'No specific transcript found for this consultation.';

    let fullResponse = `Based on your consultation: ${transcriptContext}`;

    if (lowerQuery.includes('headache')) {
      fullResponse =
        'While the transcript does not explicitly mention headaches, if you are experiencing a severe new headache, please consult a doctor immediately.';
    } else if (lowerQuery.includes('fever')) {
      fullResponse = `A fever wasn't the primary focus of this transcript (${transcriptContext}). Drink plenty of fluids and rest.`;
    } else if (
      lowerQuery.includes('hello') ||
      lowerQuery.includes('hi') ||
      lowerQuery.includes('summarize')
    ) {
      fullResponse = `Hello! To summarize: ${transcriptContext} What else would you like to know?`;
    }

    const chunks = fullResponse.split(' ');

    // Initial artificial delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 0; i < chunks.length; i++) {
      // Simulate network latency per chunk
      await new Promise((resolve) => setTimeout(resolve, 50));
      yield chunks[i] + (i < chunks.length - 1 ? ' ' : '');
    }
  }
}

export const chatService = new ChatService();
