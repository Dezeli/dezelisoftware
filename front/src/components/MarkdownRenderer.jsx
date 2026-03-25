import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownRenderer({ content }) {
    return (
        /* CSS에서 정의한 markdown-body 클래스 하나로 끝 // 수정 */
        <div className="markdown-body">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ 
                                    padding: '1.5rem',
                                    margin: '1.5rem 0', 
                                    borderRadius: '1rem', 
                                    border: '1px solid #27272a',
                                    fontSize: '0.9rem', // 폰트 크기도 살짝 조절하면 더 예쁩니다.
                                    background: '#18181b', // 배경색을 더 진하게 잡을 수도 있습니다.
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            /* 인라인 코드는 CSS의 .markdown-body :not(pre) > code 가 처리함 // 수정 */
                            <code {...props}>{children}</code>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}