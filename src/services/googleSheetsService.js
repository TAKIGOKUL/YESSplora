// Google Sheets Integration Service
// Note: This is a simplified implementation. In production, you would need:
// 1. Google Sheets API credentials
// 2. Proper authentication flow
// 3. Backend proxy to handle API calls securely

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = '1_SVgTT2Fsv2AKGyUfPtQCJiHddvm7keC_yeDBDCEgAE';
    this.apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Mock implementation - replace with actual Google Sheets API calls
  async saveParticipantData(participantData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would make an actual API call to Google Sheets
      console.log('Saving participant data to Google Sheets:', participantData);

      // Mock response
      return {
        success: true,
        message: 'Data saved successfully',
        rowNumber: Math.floor(Math.random() * 1000) + 1
      };
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      throw new Error('Failed to save data to Google Sheets');
    }
  }

  // Get participant data (for admin dashboard)
  async getParticipantData() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - in real implementation, fetch from Google Sheets
      const mockData = [
        {
          name: 'John Doe',
          ticketId: 'YESS001',
          task1: 'Completed',
          task2: 'Completed',
          task3: 'Pending',
          task4: 'Pending',
          task5: 'Pending',
          task6: 'Pending',
          task7: 'Pending',
          task8: 'Pending',
          task9: 'Pending',
          bossLevel: 'Not Started',
          bonusLevel: 'Not Started',
          completed: 'No',
          timeTook: '15:30'
        },
        {
          name: 'Jane Smith',
          ticketId: 'YESS002',
          task1: 'Completed',
          task2: 'Completed',
          task3: 'Completed',
          task4: 'Completed',
          task5: 'Completed',
          task6: 'Pending',
          task7: 'Pending',
          task8: 'Pending',
          task9: 'Pending',
          bossLevel: 'Not Started',
          bonusLevel: 'Not Started',
          completed: 'No',
          timeTook: '25:45'
        }
      ];

      return {
        success: true,
        data: mockData
      };
    } catch (error) {
      console.error('Error fetching participant data:', error);
      throw new Error('Failed to fetch participant data');
    }
  }

  // Update task completion
  async updateTaskCompletion(participantId, taskNumber, completionStatus) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log(`Updating task ${taskNumber} for participant ${participantId}:`, completionStatus);

      return {
        success: true,
        message: `Task ${taskNumber} updated successfully`
      };
    } catch (error) {
      console.error('Error updating task completion:', error);
      throw new Error('Failed to update task completion');
    }
  }

  // Get leaderboard data
  async getLeaderboard() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Mock leaderboard data
      const mockLeaderboard = [
        { rank: 1, name: 'Alice Johnson', ticketId: 'YESS003', completedTasks: 9, timeTook: '45:20' },
        { rank: 2, name: 'Bob Wilson', ticketId: 'YESS004', completedTasks: 8, timeTook: '52:15' },
        { rank: 3, name: 'Carol Davis', ticketId: 'YESS005', completedTasks: 7, timeTook: '58:30' },
        { rank: 4, name: 'David Brown', ticketId: 'YESS006', completedTasks: 6, timeTook: '1:05:45' },
        { rank: 5, name: 'Eva Miller', ticketId: 'YESS007', completedTasks: 5, timeTook: '1:12:20' }
      ];

      return {
        success: true,
        data: mockLeaderboard
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard data');
    }
  }

  // Real Google Sheets API implementation (commented out - requires proper setup)
  /*
  async saveParticipantDataReal(participantData) {
    const url = `${this.baseUrl}/${this.spreadsheetId}/values/A:Z:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
    
    const values = [
      [
        participantData.name,
        participantData.ticketId,
        participantData.task1 || 'Pending',
        participantData.task2 || 'Pending',
        participantData.task3 || 'Pending',
        participantData.task4 || 'Pending',
        participantData.task5 || 'Pending',
        participantData.task6 || 'Pending',
        participantData.task7 || 'Pending',
        participantData.task8 || 'Pending',
        participantData.task9 || 'Pending',
        participantData.bossLevel || 'Not Started',
        participantData.bonusLevel || 'Not Started',
        participantData.completed || 'No',
        participantData.timeTook || '00:00'
      ]
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
  */
}

// Create and export a singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;

