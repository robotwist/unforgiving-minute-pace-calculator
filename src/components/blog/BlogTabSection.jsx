import React from 'react';
import { Star } from 'lucide-react';
import DOMPurify from 'dompurify';
import PremiumPaywall from './PremiumPaywall';
import { premiumArticleExample } from '../../data/premiumContent';

const BlogTabSection = ({ 
  colors, 
  selectedArticle, 
  setSelectedArticle,
  featuredArticles,
  articles,
  userSubscription,
  onSubscribe
}) => {
  // Combine free and premium articles
  const allArticles = [...articles, premiumArticleExample];
  return (
    <>
      {/* Blog Articles List */}
      {!selectedArticle && (
        <div className="space-y-8">
          <div className="um-text-center um-space-y-4">
            <h2 className="um-text-4xl um-font-bold" style={{ color: colors.black }}>
              Running Insights & Articles
            </h2>
            <p className="um-text-xl" style={{ color: colors.darkGreen }}>
              Evidence-based training articles and VDOT insights from professional coaches
            </p>
          </div>

          {/* Featured Articles */}
          <div className="space-y-6">
            <h3 className="um-text-2xl um-font-bold" style={{ color: colors.black }}>
              Featured Articles
            </h3>
            
            <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-lg-grid-cols-3 gaum-p-6">
              {featuredArticles.map((article) => (
                <div key={article.id} className="munich-card um-relative um-overflow-hidden group um-cursor-pointer transition-all hover:shadow-xl" 
                     onClick={() => setSelectedArticle(article)}>
                  <div className="um-absolute top-2 right-2 w-6 h-6 geometric-diamond" style={{ 
                    backgroundColor: colors.lightBlue,
                    opacity: 0.7
                  }}></div>
                  
                  <div className="munich-card-body">
                    <div className="mb-4">
                      <span className="um-text-xs um-font-bold px-3 py-1 um-um-rounded-full" style={{ 
                        backgroundColor: colors.lightBlue + '20',
                        color: colors.lightBlue
                      }}>
                        {article.category.toUpperCase()}
                      </span>
                    </div>
                    
                    <h4 className="um-text-lg um-font-bold um-mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                      {article.title}
                    </h4>
                    
                    <p className="um-text-sm um-mb-4" style={{ color: colors.darkGreen }}>
                      {article.excerpt}
                    </p>
                    
                    <div className="um-flex um-items-center um-justify-between">
                      <span className="um-text-xs" style={{ color: colors.silver }}>
                        {article.readTime}
                      </span>
                      <button className="um-text-xs um-font-medium um-px-4 um-py-2 um-um-rounded-full transition-all hover:shadow-md" style={{
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
            <h3 className="um-text-2xl um-font-bold" style={{ color: colors.black }}>
              All Articles
            </h3>
            
            <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 gaum-p-6">
              {allArticles.map((article) => (
                <div key={article.id} className="munich-card um-relative um-overflow-hidden group um-cursor-pointer transition-all hover:shadow-lg border-l-4" 
                     style={{ borderLeftColor: article.featured ? colors.orange : colors.lightGreen }}
                     onClick={() => setSelectedArticle(article)}>
                  
                  {/* Premium Badge */}
                  {article.isPremium && (
                    <div className="um-absolute top-2 right-2 um-text-xs um-font-bold px-2 py-1 um-um-rounded-full" style={{
                      backgroundColor: colors.orange,
                      color: colors.white
                    }}>
                      PREMIUM
                    </div>
                  )}
                  
                  <div className="munich-card-body">
                    <div className="um-flex um-items-start um-justify-between um-mb-3">
                      <span className="um-text-xs um-font-medium px-2 py-1 um-rounded" style={{ 
                        backgroundColor: article.featured ? colors.orange + '20' : colors.lightGreen + '20',
                        color: article.featured ? colors.orange : colors.lightGreen
                      }}>
                        {article.category}
                      </span>
                      {article.featured && (
                        <Star className="w-4 h-4" style={{ color: colors.orange }} />
                      )}
                    </div>
                    
                    <h4 className="um-text-base um-font-bold um-mb-2 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                      {article.title}
                    </h4>
                    
                    <p className="um-text-sm um-mb-3" style={{ color: colors.darkGreen }}>
                      {article.excerpt}
                    </p>
                    
                    <div className="um-flex um-items-center um-justify-between um-text-xs">
                      <span style={{ color: colors.silver }}>
                        {article.readTime}
                      </span>
                      <span className="um-font-medium group-hover:underline" style={{ color: colors.lightBlue }}>
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
          <div className="um-flex um-items-center gaum-p-4 um-mb-6">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="munich-btn munich-btn-outline"
            >
              ← Back to Articles
            </button>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl um-mx-auto">
            <div className="munich-card">
              <div className="munich-card-body space-y-6">
                <div className="um-border-b pb-6" style={{ borderColor: colors.border }}>
                  <div className="um-flex um-items-center gap-2 um-mb-4">
                    <span className="um-text-sm um-font-medium px-3 py-1 um-um-rounded-full" style={{ 
                      backgroundColor: colors.lightBlue + '20',
                      color: colors.lightBlue
                    }}>
                      {selectedArticle.category}
                    </span>
                    {selectedArticle.isPremium && (
                      <span className="um-text-sm um-font-bold px-3 py-1 um-um-rounded-full" style={{
                        backgroundColor: colors.orange,
                        color: colors.white
                      }}>
                        PREMIUM
                      </span>
                    )}
                    <span className="um-text-sm" style={{ color: colors.silver }}>
                      {selectedArticle.readTime}
                    </span>
                  </div>
                  <h1 className="um-text-3xl um-md-text-4xl um-font-bold um-mb-4" style={{ color: colors.black }}>
                    {selectedArticle.title}
                  </h1>
                  <p className="um-text-lg" style={{ color: colors.darkGreen }}>
                    {selectedArticle.excerpt}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none" style={{ color: colors.black }}>
                  {/* Premium Content Check */}
                  {selectedArticle.isPremium && (!userSubscription || userSubscription.tier !== selectedArticle.subscriptionTier) ? (
                    <PremiumPaywall 
                      article={selectedArticle}
                      colors={colors}
                      onSubscribe={onSubscribe}
                    />
                  ) : (
                    <div 
                      className="article-content"
                      style={{ 
                        lineHeight: '1.8',
                        fontSize: '1.1rem'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize((selectedArticle.fullContent || selectedArticle.content)
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^# (.*?)$/gm, '<h2 style="font-size: 1.8rem; font-weight: bold; margin: 2rem 0 1rem 0; color: ' + colors.black + ';">$1</h2>'))
                          .replace(/^## (.*?)$/gm, '<h3 style="font-size: 1.4rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: ' + colors.darkGreen + ';">$1</h3>')
                          .replace(/^\* (.*?)$/gm, '<li>$1</li>')
                          .replace(/(<li>.*<\/li>)/gs, '<ul style="margin: 1rem 0; padding-left: 1.5rem; list-style: disc;">$1</ul>')
                          .replace(/^(?!<[hul])/gm, '<p>')
                          .replace(/$(?!<\/)/gm, '</p>')
                      }} 
                    />
                  )}
                </div>

                {/* Article Actions */}
                <div className="um-border-t pt-6 flex um-justify-between um-items-center" style={{ borderColor: colors.border }}>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="munich-btn munich-btn-outline"
                  >
                    ← Back to Articles
                  </button>
                  <div className="um-flex gap-2">
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
