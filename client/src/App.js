import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Email state
  const [recipientEmails, setRecipientEmails] = useState('');
  const [emailSubject, setEmailSubject] = useState('Meeting Summary');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid text file (.txt)');
      setSelectedFile(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedFile) {
      setError('Please select a transcript file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('transcript', selectedFile);
    formData.append('customInstruction', customInstruction);

    try {
      const response = await axios.post('/api/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data.summary);
      setSuccess('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error.response?.data?.error || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmails.trim() || !summary.trim()) {
      setError('Please provide recipient emails and ensure summary is generated');
      return;
    }

    setIsSendingEmail(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/send-email', {
        recipientEmails: recipientEmails.trim(),
        subject: emailSubject,
        summary: summary
      });

      setSuccess(response.data.message);
      setRecipientEmails('');
      setEmailSubject('Meeting Summary');
    } catch (error) {
      console.error('Error sending email:', error);
      setError(error.response?.data?.error || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFile(null);
    setCustomInstruction('');
    setSummary('');
    setRecipientEmails('');
    setEmailSubject('Meeting Summary');
    setError('');
    setSuccess('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Meeting Notes Summarizer</h1>
        <p>Upload a transcript and get AI-powered summaries with custom instructions</p>
      </header>

      <main className="App-main">
        {/* File Upload Section */}
        <section className="section">
          <h2>1. Upload Transcript</h2>
          <div className="file-upload">
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileSelect}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose a text file (.txt)'}
            </label>
          </div>
          {selectedFile && (
            <p className="file-info">Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
          )}
        </section>

        {/* Custom Instruction Section */}
        <section className="section">
          <h2>2. Custom Instructions</h2>
          <textarea
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="Enter custom instructions (e.g., 'Summarize in bullet points for executives', 'Highlight only action items')"
            rows="3"
            className="instruction-input"
          />
        </section>

        {/* Generate Summary Section */}
        <section className="section">
          <h2>3. Generate Summary</h2>
          <button
            onClick={handleGenerateSummary}
            disabled={!selectedFile || isLoading}
            className="generate-btn"
          >
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>
        </section>

        {/* Summary Display Section */}
        {summary && (
          <section className="section">
            <h2>4. AI Generated Summary</h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows="10"
              className="summary-editor"
              placeholder="AI summary will appear here. You can edit it before sending."
            />
          </section>
        )}

        {/* Email Section */}
        {summary && (
          <section className="section">
            <h2>5. Share via Email</h2>
            <div className="email-form">
              <div className="form-group">
                <label htmlFor="emails">Recipient Email(s):</label>
                <input
                  type="text"
                  id="emails"
                  value={recipientEmails}
                  onChange={(e) => setRecipientEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="email-input"
                />
                <small>Separate multiple emails with commas</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="email-input"
                />
              </div>

              <button
                onClick={handleSendEmail}
                disabled={!recipientEmails.trim() || isSendingEmail}
                className="send-email-btn"
              >
                {isSendingEmail ? 'Sending...' : 'Send Summary via Email'}
              </button>
            </div>
          </section>
        )}

        {/* Clear All Button */}
        {(selectedFile || summary || recipientEmails) && (
          <section className="section">
            <button onClick={handleClearAll} className="clear-btn">
              Clear All
            </button>
          </section>
        )}

        {/* Status Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </main>
    </div>
  );
}

export default App;
