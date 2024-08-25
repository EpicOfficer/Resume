// src/utils/richTextRenderOptions.ts
import * as React from "react";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Document, Node } from "@contentful/rich-text-types";

export const richTextRenderOptions: Options = {
    renderNode: {
        [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
        [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
        [BLOCKS.LIST_ITEM]: (node, children) => {
            const transformedChildren = documentToReactComponents(
                {
                    ...node,
                    content: node.content,
                } as unknown as Document,
                {
                    renderMark: {},
                    renderNode: {
                        [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => children,
                        [BLOCKS.LIST_ITEM]: (node: Node, children: React.ReactNode) => children,
                    },
                }
            );
            return <li>{transformedChildren}</li>;
        },
        [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
        [INLINES.HYPERLINK]: (node, children) => (
            <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
    },
};