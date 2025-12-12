import React from 'react';

const ArticleModal = ({ article, colors, onClose }) => {
  if (!article) return null;

  // Convert markdown-like content to HTML (basic implementation)
  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4" style={{ color: colors.black }}>{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mb-3 mt-6" style={{ color: colors.black }}>{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mb-2 mt-4" style={{ color: colors.black }}>{line.substring(4)}</h3>;
        }
        
        // Italics
        if (line.startsWith('*') && line.endsWith('*') && line.length > 2) {
          return <p key={index} className="text-center italic mb-4" style={{ color: colors.darkGreen }}>{line.slice(1, -1)}</p>;
        }
        
        // Bold
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold mb-2" style={{ color: colors.black }}>{line.slice(2, -2)}</p>;
        }
        
        // Horizontal rule
        if (line === '---') {
          return <hr key={index} className="my-6" style={{ borderColor: colors.gray }} />;
        }
        
        // Empty line
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraph
        return <p key={index} className="mb-4 leading-relaxed" style={{ color: colors.black }}>{line}</p>;
      });
  };

  return (
    <div className="um-modal-overlay um-modal-overlay--dim um-modal-overlay--scroll">
      <div className="munich-card um-modal-panel um-modal-panel--4xl">
        <div className="munich-card-header relative overflow-hidden" style={{ 
          backgroundColor: colors.lightBlue 
        }}>
          <div className="progressive-melange um-melange-overlay um-melange-overlay--20"></div>
          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.8
          }}></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="mb-2">
                <span className="text-xs font-medium px-3 py-1" style={{ 
                  backgroundColor: colors.white,
                  color: colors.lightBlue 
                }}>
                  {article.category}
                </span>
              </div>
              <h3 className="font-bold" style={{ 
                color: colors.white,
                fontSize: 'var(--text-2xl)'
              }}>
                {article.title}
              </h3>
              <p className="mt-2" style={{ 
                color: colors.white,
                opacity: 0.9,
                fontSize: 'var(--text-base)'
              }}>{article.readTime}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            {formatContent(article.content)}
          </div>
          
          <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.gray }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: colors.darkGreen }}>
                  Did you find this article helpful?
                </p>
              </div>
              <button
                onClick={onClose}
                className="munich-btn munich-btn-primary"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
