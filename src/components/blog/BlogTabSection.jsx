import React from 'react';
import { Star } from 'lucide-react';

const BlogTabSection = ({ 
  colors, 
  selectedArticle, 
  setSelectedArticle,
  featuredArticles,
  articles
}) => {
  return (
    <>
      {/* Blog Articles List */}
      {!selectedArticle && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
              Running Insights & Articles
            </h2>
            <p className="text-xl" style={{ color: colors.darkGreen }}>
              Evidence-based training articles and VDOT insights from professional coaches
            </p>
          </div>

          {/* Featured Articles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
              Featured Articles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div key={article.id} className="munich-card relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl" 
                     onClick={() => setSelectedArticle(article)}>
                  <div className="absolute top-2 right-2 w-6 h-6 geometric-diamond" style={{ 
                    backgroundColor: colors.lightBlue,
                    opacity: 0.7
                  }}></div>
                  
                  <div className="munich-card-body">
                    <div className="mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ 
                        backgroundColor: colors.lightBlue + '20',
                        color: colors.lightBlue
                      }}>
                        {article.category.toUpperCase()}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                      {article.title}
                    </h4>
                    
                    <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: colors.silver }}>
                        {article.readTime}
                      </span>
                      <button className="text-xs font-medium px-4 py-2 rounded-full transition-all hover:shadow-md" style={{
                        backgroundColor: colors.lightBlue,
                        color: colors.white
                      }}>
                        Read Article
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
              All Articles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="munich-card relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg border-l-4" 
                     style={{ borderLeftColor: article.featured ? colors.orange : colors.lightGreen }}
                     onClick={() => setSelectedArticle(article)}>
                  
                  <div className="munich-card-body">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded" style={{ 
                        backgroundColor: article.featured ? colors.orange + '20' : colors.lightGreen + '20',
                        color: article.featured ? colors.orange : colors.lightGreen
                      }}>
                        {article.category}
                      </span>
                      {article.featured && (
                        <Star className="w-4 h-4" style={{ color: colors.orange }} />
                      )}
                    </div>
                    
                    <h4 className="text-base font-bold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                      {article.title}
                    </h4>
                    
                    <p className="text-sm mb-3" style={{ color: colors.darkGreen }}>
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: colors.silver }}>
                        {article.readTime}
                      </span>
                      <span className="font-medium group-hover:underline" style={{ color: colors.lightBlue }}>
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="space-y-6">
          {/* Article Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="munich-btn munich-btn-outline"
            >
              ← Back to Articles
            </button>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            <div className="munich-card">
              <div className="munich-card-body space-y-6">
                <div className="border-b pb-6" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ 
                      backgroundColor: colors.lightBlue + '20',
                      color: colors.lightBlue
                    }}>
                      {selectedArticle.category}
                    </span>
                    <span className="text-sm" style={{ color: colors.silver }}>
                      {selectedArticle.readTime}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.black }}>
                    {selectedArticle.title}
                  </h1>
                  <p className="text-lg" style={{ color: colors.darkGreen }}>
                    {selectedArticle.excerpt}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none" style={{ color: colors.black }}>
                  <div 
                    className="article-content"
                    style={{ 
                      lineHeight: '1.8',
                      fontSize: '1.1rem'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: selectedArticle.content
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^# (.*?)$/gm, '<h2 style="font-size: 1.8rem; font-weight: bold; margin: 2rem 0 1rem 0; color: ' + colors.black + ';">$1</h2>')
                        .replace(/^## (.*?)$/gm, '<h3 style="font-size: 1.4rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: ' + colors.darkGreen + ';">$1</h3>')
                        .replace(/^\* (.*?)$/gm, '<li>$1</li>')
                        .replace(/(<li>.*<\/li>)/gs, '<ul style="margin: 1rem 0; padding-left: 1.5rem; list-style: disc;">$1</ul>')
                        .replace(/^(?!<[hul])/gm, '<p>')
                        .replace(/$(?!<\/)/gm, '</p>')
                    }} 
                  />
                </div>

                {/* Article Actions */}
                <div className="border-t pt-6 flex justify-between items-center" style={{ borderColor: colors.border }}>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="munich-btn munich-btn-outline"
                  >
                    ← Back to Articles
                  </button>
                  <div className="flex gap-2">
                    <button className="munich-btn munich-btn-primary">
                      Share Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogTabSection;
