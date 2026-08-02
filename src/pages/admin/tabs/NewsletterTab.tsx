import { useState, useEffect, useRef } from 'react';
import { Download, Upload, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { mockLeads } from "../../../data/mockAdminData";

export function NewsletterTab() {
  const [leads, setLeads] = useState<any[]>(mockLeads);
  const [loading, setLoading] = useState(true);
  
  // Compose state
  const [isComposing, setIsComposing] = useState(false);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{success?: boolean; message?: string} | null>(null);

  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLeads(data);
      }
    } catch (err) {
      console.log('Using mock leads data for local development.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSendNewsletter = async () => {
    if (!subject || !htmlContent) {
      setSendResult({ success: false, message: 'Please provide both a subject and email content.' });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, htmlContent }),
      });

      const data = await res.json();

      if (res.ok) {
        setSendResult({ success: true, message: `Successfully sent to ${data.recipientCount} subscribers!` });
        setSubject('');
        setHtmlContent('');
      } else {
        setSendResult({ success: false, message: data.message || 'Failed to send newsletter.' });
      }
    } catch (error) {
      setSendResult({ success: false, message: 'An error occurred while sending the email.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    // Create CSV headers
    const headers = ['Email Address', 'Subscribed Date', 'Source', 'Status'];
    
    // Map leads to CSV rows
    const csvRows = leads.map(lead => 
      `"${lead.email || ''}","${lead.date || ''}","${lead.source || ''}","${lead.status || 'Active'}"`
    );
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `estatelab-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Double check that it's actually a CSV file (extra security)
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      alert("Invalid file type. Please upload a .csv file.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length <= 1) {
        alert("CSV seems to be empty or has only headers.");
        return;
      }
      
      const newLeads = [];
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const emailIndex = headers.findIndex(h => h.includes('email'));
      
      if (emailIndex === -1) {
        alert("Could not find an 'Email' column in the CSV. Please ensure your first row has a header like 'Email' or 'Email Address'.");
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        // Simple CSV parse (does not handle commas inside quotes well, but fine for basic emails)
        const columns = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
        const email = columns[emailIndex];
        
        if (email && email.includes('@')) {
           newLeads.push({
             id: Date.now().toString() + Math.random().toString(),
             email: email,
             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
             source: 'CSV Import',
             status: 'Active'
           });
        }
      }

      if (newLeads.length === 0) {
        alert("No valid email addresses found to import.");
        return;
      }

      const res = await fetch('/api/admin/import-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: newLeads })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchLeads(); // Refresh table
      } else {
        alert(data.message || 'Error importing leads');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse or upload CSV.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isComposing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsComposing(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-serif text-[#0F4C5C]">Compose Newsletter</h2>
              <p className="text-gray-500">Send an email to {leads.length} subscribers.</p>
            </div>
          </div>
          <button 
            onClick={handleSendNewsletter}
            disabled={isSending}
            className="bg-[#0F4C5C] text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-[#0a3844] transition-colors disabled:opacity-70"
          >
            <Send size={18} />
            <span>{isSending ? 'Sending...' : 'Send Newsletter'}</span>
          </button>
        </div>

        {sendResult && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 ${sendResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {sendResult.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{sendResult.message}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Exciting New Property Launch!"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content (HTML Supported)</label>
            <div className="bg-amber-50 text-amber-800 text-xs px-4 py-3 rounded-lg mb-4 border border-amber-200">
              <strong>Pro tip:</strong> We automatically wrap your message in the beautiful Estate.Lab email template. Just type your paragraphs below. You can use standard HTML tags like &lt;b&gt;, &lt;br&gt;, and &lt;a&gt; if you need formatting.
            </div>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Write your newsletter content here..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all resize-y font-sans"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Newsletter Subscribers</h2>
          <p className="text-gray-500">Manage your list and send updates.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <span className="font-medium text-sm">{isImporting ? 'Importing...' : 'Import CSV'}</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span className="font-medium text-sm">Export CSV</span>
          </button>
          <button 
            onClick={() => setIsComposing(true)}
            className="bg-[#0F4C5C] text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-[#0a3844] transition-colors shadow-sm"
          >
            <Mail size={18} />
            <span className="font-medium text-sm">Compose Email</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading subscribers...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium">Subscribed Date</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((sub, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.date}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.source}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-red-500 text-sm font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
