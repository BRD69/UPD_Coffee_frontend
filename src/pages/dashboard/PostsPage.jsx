import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { postService } from '../../services/postService';
import { userService } from '../../services/userService';
import { createPortal } from 'react-dom';
import { FaTrash, FaImage, FaChevronDown, FaLink, FaPaperPlane, FaUndo, FaEye, FaMoon, FaSun, FaHeart, FaSync } from 'react-icons/fa';
import { showNotification } from '../../utils/showNotification';

const Container = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 768px) {
        padding: 10px 0;
        width: 100%;
        overflow-x: hidden;
    }
`;

const Title = styled.h2`
    color: #2c3e50;
    margin: 0;
`;

// Стили для левой части (таблица постов)
const PostsTableContainer = styled.div`
    flex: 5 1 0%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 150px);
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 15px;
        height: auto;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const TableHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 10px 6px;
    }
`;

const DateFilter = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        width: 100%;
    }
`;

const DateInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    color: #495057;
    width: auto;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    @media (max-width: 768px) {
        width: 100%;
        font-size: 15px;
    }
`;

const FilterLabel = styled.span`
    color: #495057;
    font-size: 14px;
    @media (max-width: 768px) {
        margin-bottom: 2px;
    }
`;

const FetchPostsButton = styled.button`
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
    border: 1px solid rgba(52, 152, 219, 0.3);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
        width: 100%;
    }

    &:hover {
        background-color: rgba(52, 152, 219, 0.2);
        border-color: rgba(52, 152, 219, 0.5);
    }

    &:active {
        background-color: rgba(52, 152, 219, 0.3);
    }
`;

const TableWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    margin-top: 20px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    flex: 1;
    min-height: 0;

    @media (max-width: 768px) {
        margin-top: 15px;
    }
`;

const MobileTable = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    border-radius: 8px;
    overflow: hidden;
    @media (max-width: 768px) {
        display: none;
    }
`;

const TableHeader = styled.thead`
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 1;
`;

const TableRow = styled.tr`
    transition: all 0.2s ease;
    border-bottom: 1px solid #e9ecef;

    &:nth-child(even) {
        background-color: #f8f9fa;
    }

    &:hover {
        background-color: #e9ecef;
        cursor: pointer;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    ${props => props.$isDeleted && `
        color: #6c757d;
        text-decoration: line-through;
        opacity: 0.7;
        pointer-events: none;
        background-color: #f8f9fa;

        td {
            color: #6c757d;
        }

        a {
            color: #6c757d;
            pointer-events: none;
        }

        &:hover {
            transform: none;
            box-shadow: none;
        }
    `}

    ${props => props.$isScheduled && `
        background-color: rgba(255, 236, 179, 0.3);

        &:hover {
            background-color: rgba(255, 236, 179, 0.5);
        }
    `}
`;

const TableHeaderCell = styled.th`
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    position: relative;
    white-space: nowrap;

    @media (max-width: 768px) {
        padding: 12px 8px;
        font-size: 11px;
    }

    &:first-child {
        padding-left: 20px;
    }

    &:last-child {
        padding-right: 20px;
    }
`;

const TableCell = styled.td`
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    color: #212529;
    font-size: 14px;
    transition: all 0.2s ease;
    white-space: nowrap;

    @media (max-width: 768px) {
        padding: 12px 8px;
        font-size: 12px;
    }

    &:first-child {
        padding-left: 20px;
    }

    &:last-child {
        padding-right: 20px;
    }
`;

const PostLink = styled.a`
    color: #3498db;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    padding-bottom: 2px;
    font-weight: 500;

    &:hover {
        color: #2980b9;
    }

    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: #3498db;
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease;
    }

    &:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

// Стили для правой части (форма создания поста)
const NewPostRow = styled.div`
    display: flex;
    width: 100%;
    gap: 20px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
        width: 100%;
        margin-bottom: 16px;
    }
`;

const NewPostContainer = styled.div`
    flex: 8 1 0%;
    background-color: ${props => {
        switch (props.$postType) {
            case 'info':
                return 'rgba(52, 152, 219, 0.2)';
            case 'rubric':
                return 'rgba(46, 204, 113, 0.2)';
            case 'challenge':
                return 'rgba(230, 126, 34, 0.2)';
            case 'update':
                return 'rgba(241, 196, 15, 0.2)';
            default:
                return 'white';
        }
    }};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: column;
    height: auto;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

const PreviewPostContainer = styled.div`
    flex: 1;
    padding: 20px;
    background-color: ${props => props.$isDarkMode ? '#354457' : '#f8f9fa'};
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    width: 100%;
`;

const FormContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 10px;
    overflow-y: auto;
    padding-right: 10px;
`;

const PostTypeSelect = styled.select`
    padding: 8px 32px 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    margin-left: 10px;
    background-color: white;
    cursor: pointer;
    appearance: none;
    background-image: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;

    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
    }

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
    }

    &:hover {
        border-color: #3498db;
    }
`;

const SelectWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin-left: 10px;

    @media (max-width: 768px) {
        margin-left: 0;
        width: 100%;
    }

    svg {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        pointer-events: none;
    }
`;

const PostTypeOption = styled.option`
    padding: 8px;
    color: #2c3e50;
    background-color: white;
    font-size: 14px;

    &[value="info"] {
        color: #3498db;
    }

    &[value="rubric"] {
        color: #2ecc71;
    }

    &[value="challenge"] {
        color: #e67e22;
    }

    &[value="update"] {
        color: #f1c40f;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 15px;
    }
`;

const ImagePreview = styled.div`
    height: 36px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
`;

const ImagePreviewImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 4px;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #495057;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    min-height: 350px;
    resize: vertical;
    position: relative;
    z-index: 1;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const FormattedTextArea = styled.div`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    min-height: 350px;
    position: relative;
    z-index: 1;
    background-color: white;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #111 !important;
    * {
        color: #111 !important;
    }
    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
    b {
        font-weight: bold;
    }
    i {
        font-style: italic;
    }
    u {
        text-decoration: underline;
    }
    s {
        text-decoration: line-through;
    }
    a {
        color: #3498db !important;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const TagsInput = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    min-height: 40px;
`;

const Tag = styled.span`
    background-color: #e9ecef;
    color: #495057;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
`;

const TagRemoveButton = styled.button`
    background: none;
    border: none;
    color: #6c757d;
    margin-left: 5px;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;

    &:hover {
        color: #dc3545;
    }
`;

const UserMentionContainer = styled.div`
    margin-top: 15px;
`;

const UserMentionInput = styled.div`
    position: relative;
`;

const TextAreaContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const TextAreaWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 20px;
    position: relative;
`;

const TextAreaBlock = styled.div`
    flex: 8 1 0%;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const SideActionsBlock = styled.div`
    flex: 4 1 0%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    position: relative;
`;

const ImageActions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    border-radius: 4px;
`;

const ImageUploadButton = styled.label`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    height: 36px;
    box-sizing: border-box;
    white-space: nowrap;

    &:hover {
        background-color: #e9ecef;
    }
`;

const DeleteImageButton = styled.button`
    background-color: #f8f9fa;
    color: #dc3545;
    border: 1px solid #dc3545;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;

    &:hover {
        background-color: #dc3545;
        color: white;
    }
`;

const HiddenFileInput = styled.input`
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
`;

const PublishButton = styled.button`
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 36px;

    @media (max-width: 768px) {
        width: 100%;
        margin-bottom: 8px;
        order: 1;
    }

    &:hover {
        background-color: #2980b9;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const ResetDraftButton = styled.button`
    background-color: #f8f9fa;
    color: #dc3545;
    border: 1px solid #dc3545;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;

    &:hover {
        background-color: #dc3545;
        color: white;
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        width: 36px;
        margin-bottom: 0;
        order: 3;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`;

const FormattingToolbar = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: #f8f9fa;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        gap: 3px;
        padding: 3px;
    }
`;

const Divider = styled.div`
    width: 1px;
    height: 20px;
    background-color: #ced4da;
    margin: 0 5px;
`;

const FormatButton = styled.button`
    background: none;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #495057;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e9ecef;
    }
`;

const EmojiPickerButton = styled(FormatButton)`
    position: relative;
`;

const EmojiPickerDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
`;

const EmojiItem = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const PreviewWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border-radius: 18px;
    padding: 1px;
    width: 100%;
    min-height: 400px;
    /* overflow: visible; */
`;

const TelegramPostCard = styled.div`
    background: ${props => props.$isDarkMode ? '#232e3c' : '#f8f9fa'};
    border-radius: 18px;
    box-shadow: ${props => props.$isDarkMode
        ? '0 4px 24px 0 rgba(255,255,255,0.08)'
        : '0 4px 24px rgba(0,0,0,0.18)'};
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    position: relative;
`;

const TelegramPostTitle = styled.div`
    color: ${props => props.$isDarkMode ? '#fff' : '#232e3c'};
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 0;
    padding: 18px 20px 0 20px;
`;

const TelegramPostImage = styled.img`
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
    border: 8px solid
        ${props => {
        switch (props.$postType) {
            case 'info':
                return '#3498db';
            case 'rubric':
                return '#2ecc71';
            case 'challenge':
                return '#e67e22';
            case 'update':
                return '#f1c40f';
            default:
                return 'transparent';
        }
    }};
    margin: 0;
`;

const TelegramPostContent = styled.div`
    color: ${props => props.$isDarkMode ? '#fff' : '#232e3c'};
    background: none;
    line-height: 1.6;
    font-size: 15px;
    padding: 18px 20px 0 20px;
    word-break: break-word;
    white-space: pre-line;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    transition: color 0.2s;

    a {
        color: ${props => props.$isDarkMode ? '#7ecbff' : '#1a73e8'};
        text-decoration: underline;
    }
`;

const TelegramPostTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 0 20px;
    margin-top: 10px;
`;

const TelegramPostTag = styled.span`
    background: #2d3a4b;
    color: #7ecbff;
    border-radius: 8px;
    padding: 3px 12px;
    font-size: 13px;
    font-weight: 500;
`;

const TelegramPostFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 20px 14px 20px;
    color: #b0b8c1;
    font-size: 13px;
    gap: 6px;
`;

const ClockIcon = () => (
    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#b0b8c1" strokeWidth="1.5" /><path d="M8 4.5V8l2.5 2.5" stroke="#b0b8c1" strokeWidth="1.5" strokeLinecap="round" /></svg>
);

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid #e9ecef;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px 0;
    }
`;

const PreviewButton = styled.button`
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #ced4da;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 36px;

    @media (max-width: 768px) {
        width: calc(100% - 36px);
        margin-bottom: 0;
        order: 2;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    &:hover {
        background-color: #e9ecef;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
`;

const ModalContent = styled.div`
    background-color: ${props => props.$isDarkMode ? '#232e3c' : 'white'};
    border-radius: 12px;
    width: 450px;
    max-width: 95vw;
    max-height: calc(100% - 64px);
    margin: 32px 0;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    position: relative;

    @media (max-width: 768px) {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        margin: 0;
        border-radius: 0;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid ${props => props.$isDarkMode ? '#333' : '#e9ecef'};
    background-color: ${props => props.$isDarkMode ? '#203754' : 'white'};
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 16px;
    color: ${props => props.$isDarkMode ? '#fff' : '#212529'};
`;

const ThemeToggleButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: ${props => props.$isDarkMode ? '#fff' : '#6c757d'};
    padding: 5px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.$isDarkMode ? '#fff' : '#343a40'};
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: ${props => props.$isDarkMode ? '#fff' : '#6c757d'};
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.$isDarkMode ? '#fff' : '#343a40'};
    }
`;

const TelegramPostContainer = styled.div`
    padding: 20px;
    background-color: #f8f9fa;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TelegramPostInfo = styled.div`
    flex: 1;
`;

const TelegramPostDate = styled.div`
    font-size: 12px;
    color: #6c757d;
`;

const TelegramPostMentions = styled.div`
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e9ecef;
`;

const TelegramPostMention = styled.span`
    color: #3498db;
    margin-right: 8px;
    font-size: 14px;
`;

const LinkModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 400px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 15px;
    }
`;

const LinkModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const LinkModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const LinkModalTitle = styled.h3`
    margin: 0;
    font-size: 16px;
    color: #212529;
`;

const LinkModalCloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;

    &:hover {
        color: #343a40;
    }
`;

const LinkModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const LinkModalInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const LinkModalButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
`;

const LinkModalButton = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
`;

const LinkModalCancelButton = styled(LinkModalButton)`
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    color: #495057;

    &:hover {
        background-color: #e9ecef;
    }
`;

const LinkModalSubmitButton = styled(LinkModalButton)`
    background-color: #3498db;
    border: none;
    color: white;

    &:hover {
        background-color: #2980b9;
    }
`;

const LoadingSpinner = styled.div`
    text-align: center;
    padding: 20px;
    color: #6c757d;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: #dc3545;
    background-color: #f8d7da;
    border-radius: 4px;
    margin: 10px 0;
`;

const ScheduledPostContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: auto;

    @media (max-width: 768px) {
        margin-left: 0;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #495057;
    font-size: 14px;
`;

const Checkbox = styled.input`
    width: 16px;
    height: 16px;
    cursor: pointer;
`;

const DateTimeInput = styled.input`
    padding: 8px 12px;
    border: 1px solid ${props => props.$error ? '#dc3545' : '#ced4da'};
    border-radius: 4px;
    font-size: 14px;
    color: #495057;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const PostTypeButton = styled.button`
    background-color: ${props => props.$postType === 'news' ? '#3498db' : '#2ecc71'};
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.$postType === 'news' ? '#2980b9' : '#27ae60'};
    }
`;

const HashtagModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 400px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 15px;
    }
`;

const HashtagModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const HashtagModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const HashtagModalTitle = styled.h3`
    margin: 0;
    font-size: 16px;
    color: #212529;
`;

const HashtagModalCloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;

    &:hover {
        color: #343a40;
    }
`;

const HashtagModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const HashtagModalInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const HashtagModalButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
`;

const HashtagModalButton = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
`;

const HashtagModalCancelButton = styled(HashtagModalButton)`
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    color: #495057;

    &:hover {
        background-color: #e9ecef;
    }
`;

const HashtagModalSubmitButton = styled(HashtagModalButton)`
    background-color: #3498db;
    border: none;
    color: white;

    &:hover {
        background-color: #2980b9;
    }
`;

const HashtagButton = styled(FormatButton)`
    margin-left: auto;
    background: none;
    color: #2c3e50;
    font-weight: 600;
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover, &:focus {
        background: rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
    }
`;

const HashtagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
`;

const HashtagTitle = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: #1976d2;
    margin-bottom: 6px;
    margin-left: 2px;
`;

const HashtagItem = styled.div`
    background-color: #f8f9fa;
    color: #1a73e8;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    width: auto;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #ced4da;

    &:hover {
        background-color: #e9ecef;
        border-color: #adb5bd;
    }
`;

const HashtagRemoveButton = styled.button`
    background: none;
    border: none;
    color: #dc3545;
    margin-left: 5px;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 1;
    }
`;

const UserMentionDropdown = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    border: 2px solid #3498db;
    border-radius: 8px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    display: ${props => props.$show ? 'block' : 'none'};
`;

const UserMentionSearch = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 12px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const UserMentionListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: calc(100% - 50px); /* Учитываем высоту поиска и отступы */
    overflow-y: auto;
`;

const UserMentionItem = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: #495057;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserName = styled.span`
    font-weight: 500;
    color: #212529;
    font-size: 12px;
`;

const UserUsername = styled.span`
    color: #6c757d;
    font-size: 12px;
`;

const VerifiedBadge = styled.span`
    background-color: rgba(40, 167, 69, 0.2);
    color: #28a745;
    padding: 2px 6px;
    border-radius: 50%;
    font-size: 10px;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(40, 167, 69, 0.3);
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 10px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        gap: 4px;
        margin-top: 15px;
    }
`;

const PageButton = styled.button`
    padding: 6px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: ${props => props.$active ? '#3498db' : 'white'};
    color: ${props => props.$active ? 'white' : '#495057'};
    cursor: pointer;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
        padding: 4px 8px;
        font-size: 12px;
    }

    &:hover {
        background-color: ${props => props.$active ? '#2980b9' : '#f8f9fa'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ClearPeriodButton = styled.button`
    background-color: #f8f9fa;
    color: #6c757d;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
        background-color: #e9ecef;
        color: #495057;
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        margin-top: 2px;
    }
`;

function prepareTelegramHtml(html) {
    html = html.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');
    html = html.replace(/<(\w+)[^>]*>/gi, '<$1>');
    html = html.replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
    html = html.replace(/<p>/gi, '\n').replace(/<\/p>/gi, '');
    html = html.replace(/<br\s*\/?>/gi, '\n');
    html = html.replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n');
    html = html.replace(/^\n+/, '').replace(/\n+$/, '');
    // НЕ трогаем тройные переносы строк!
    html = html.replace(/<(?!\/?(b|i|u|s|a|code|pre|strong|em)\b)[^>]+>/gi, '');
    html = html.replace(/<strong>/gi, '<b>').replace(/<\/strong>/gi, '</b>');
    html = html.replace(/<em>/gi, '<i>').replace(/<\/em>/gi, '</i>');
    html = html.replace(/(.+)\n\1/g, '$1');
    html = html.replace(/^\s*>\s?/gm, '');
    return html;
}

// Функция для получения текста до курсора в contentEditable
function getTextBeforeCursor(editableDiv) {
    let sel = window.getSelection();
    if (!sel.rangeCount) return '';
    let range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    range.setStart(editableDiv, 0);
    return range.toString();
}

function getCurrentDateTimeLocal() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        contentHtml: '',
        image: null,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = React.useRef(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [userMentionInput, setUserMentionInput] = useState('');
    const [showUserMentionDropdown, setShowUserMentionDropdown] = useState(false);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const userMentionRef = React.useRef(null);
    const textareaRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [postType, setPostType] = useState('info');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [showHashtagModal, setShowHashtagModal] = useState(false);
    const [hashtagInput, setHashtagInput] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const formattedTextAreaRef = useRef(null);
    const mentionRangeRef = useRef(null);
    const [isDateInputError, setIsDateInputError] = useState(false);

    // Список смайликов
    const emojis = [
        '✅', '➕', '⚠️', '💻', '🚀', '💡', '📌', '💣',
        '👋', '👏', '🙌', '👊', '✌️', '🤝', '👀', '👄',
        '😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '🌟',
        '😍', '😎', '🤔', '😴', '😭', '😡', '🤮', '🤢',
        '👋', '👏', '🙌', '👊', '✌️', '🤝', '👀', '👄',
        '🌞', '🌙', '⭐', '🌈', '🍀', '🌸', '🌺', '🌻',
        '🍕', '🍔', '🍟', '🍜', '🍱', '🍣', '🍺', '🍷',
        '⚽', '🏀', '🎾', '🏈', '⚾', '🎮', '🎲', '🎯',
        '🏆', '🏅', '🥇', '🥈',
    ];

    // Загрузка постов при монтировании компонента
    useEffect(() => {
        loadPosts();
    }, []);

    // Загрузка пользователей при монтировании компонента
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                // const response = await userService.getUsers();
                const response = await userService.getVerifiedUsers();
                if (response && response.data) {
                    setUsers(response.data);
                } else {
                    console.error('Некорректный формат ответа от сервера:', response);
                    setError('Ошибка при загрузке пользователей: некорректный формат данных');
                }
            } catch (err) {
                console.error('Ошибка при загрузке пользователей:', err);
                setError('Ошибка при загрузке пользователей');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Фильтрация пользователей при изменении поискового запроса
    useEffect(() => {
        if (userMentionInput.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => {
                const username = user.username || '';
                const fio = user.fio || user.full_name || user.fullName || '';
                return username.toLowerCase().includes(userMentionInput.toLowerCase()) ||
                    fio.toLowerCase().includes(userMentionInput.toLowerCase());
            });
            setFilteredUsers(filtered);
        }
    }, [userMentionInput, users]);

    // Загрузка постов с сервера
    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await postService.getPosts();
            const loadedPosts = response.data || [];
            setPosts(loadedPosts);
            setFilteredPosts(loadedPosts); // Инициализируем filteredPosts
        } catch (err) {
            setError('Ошибка при загрузке постов');
            console.error('Ошибка при загрузке постов:', err);
        } finally {
            setLoading(false);
        }
    };

    // Закрытие выпадающего меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, tagInput.trim()]
                });
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите изображение');
                return;
            }

            // Проверяем размер файла (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер изображения не должен превышать 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Создаем URL для предпросмотра изображения
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            image: null
        });
        setImagePreview(null);
    };

    const handleContentChange = (e) => {
        const value = e.target.value;
        const htmlValue = value.replace(/\n/g, '<br>');

        setFormData({
            ...formData,
            content: value,
            contentHtml: htmlValue
        });

        // Получаем позицию курсора
        const cursorPosition = e.target.selectionStart;

        // Проверяем, был ли только что введен символ @
        const isAtSymbolJustTyped = value[cursorPosition - 1] === '@' &&
            (formData.content.length < value.length ||
                formData.content[cursorPosition - 1] !== '@');

        if (isAtSymbolJustTyped) {
            // Если только что введен символ @, показываем выпадающий список
            setShowUserMentionDropdown(true);
            setUserMentionInput('');
            setFilteredUsers(users);
        } else if (showUserMentionDropdown) {
            // Если выпадающий список уже открыт, обновляем поиск
            const lastAtPos = value.lastIndexOf('@', cursorPosition);
            if (lastAtPos !== -1) {
                const searchText = value.substring(lastAtPos + 1, cursorPosition).toLowerCase();
                setUserMentionInput(searchText);

                const filtered = users.filter(user => {
                    const username = user.username || '';
                    const fullName = user.full_name || '';
                    return username.toLowerCase().includes(searchText) ||
                        fullName.toLowerCase().includes(searchText);
                });
                setFilteredUsers(filtered);
            } else {
                // Если @ не найден, скрываем выпадающий список
                setShowUserMentionDropdown(false);
                setUserMentionInput('');
                setFilteredUsers([]);
            }
        }
    };

    // Добавляем обработчик клика вне выпадающего списка
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMentionRef.current && !userMentionRef.current.contains(event.target)) {
                setShowUserMentionDropdown(false);
                setUserMentionInput('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserSelectCE = (user) => {
        const editableDiv = formattedTextAreaRef.current;
        if (!editableDiv) return;
        const sel = window.getSelection();
        // Восстанавливаем range, если он был сохранён
        if (mentionRangeRef.current) {
            sel.removeAllRanges();
            sel.addRange(mentionRangeRef.current);
        }
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);

        // Клонируем range для поиска @
        let searchRange = range.cloneRange();
        searchRange.collapse(true);
        searchRange.setStart(editableDiv, 0);
        const textBeforeCursor = searchRange.toString();
        const lastAt = textBeforeCursor.lastIndexOf('@');
        if (lastAt === -1) return;

        // Теперь перемещаем start range к позиции после @
        // Для этого нужно пройтись по всем текстовым узлам и найти нужную позицию
        let charCount = 0;
        let found = false;
        function walk(node) {
            if (found) return;
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCount = charCount + node.textContent.length;
                if (lastAt >= charCount && lastAt < nextCount) {
                    // Нашли нужный текстовый узел и offset
                    const offset = lastAt - charCount + 1; // +1 чтобы после @
                    range.setStart(node, offset);
                    range.setEnd(node, range.endOffset);
                    found = true;
                }
                charCount = nextCount;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    walk(node.childNodes[i]);
                    if (found) break;
                }
            }
        }
        walk(editableDiv);

        // Удаляем текст от @ до курсора
        range.deleteContents();

        // Вставляем username
        const mentionNode = document.createTextNode(user.telegram_username);
        range.insertNode(mentionNode);

        // Перемещаем курсор после вставленного username
        range.setStartAfter(mentionNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        // Обновляем состояние
        setFormData({
            ...formData,
            content: editableDiv.innerHTML,
            contentHtml: editableDiv.innerHTML
        });
        if (!mentionedUsers.some(u => u.id === user.id)) {
            setMentionedUsers([...mentionedUsers, user]);
        }
        setShowUserMentionDropdown(false);
        setUserMentionInput('');
        setFilteredUsers([]);
        // Очищаем сохранённый range
        mentionRangeRef.current = null;
    };

    const handleRemoveMentionedUser = (userId) => {
        setMentionedUsers(mentionedUsers.filter(user => user.id !== userId));
    };

    // Восстановление черновика при загрузке страницы
    useEffect(() => {
        const draft = localStorage.getItem('postDraft');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                setFormData(prev => ({
                    ...prev,
                    title: parsed.title || '',
                    content: parsed.content || '',
                    contentHtml: (parsed.content || '')
                }));
                // Явно вставляем текст в contentEditable
                setTimeout(() => {
                    if (formattedTextAreaRef.current) {
                        formattedTextAreaRef.current.innerHTML = parsed.content || '';
                    }
                }, 0);
            } catch (e) {
                // ignore
            }
        }
        setIsDraftLoaded(true);
    }, []);

    // Автосохранение черновика при изменении заголовка или текста (только после загрузки)
    useEffect(() => {
        if (isDraftLoaded) {
            localStorage.setItem('postDraft', JSON.stringify({
                title: formData.title,
                content: formData.content
            }));
        }
    }, [formData.title, formData.content, isDraftLoaded]);

    // Кнопка сброса черновика
    const handleResetDraft = () => {
        localStorage.removeItem('postDraft');
        setFormData(prev => ({
            ...prev,
            title: '',
            content: '',
            contentHtml: ''
        }));
    };

    const handlePublish = async () => {
        try {
            // Проверка даты для отложенного поста
            if (isScheduled && scheduledDate) {
                const now = new Date();
                const scheduled = new Date(scheduledDate);
                if (scheduled < now) {
                    showNotification('Дата не может быть меньше текущей', 'error');
                    setIsDateInputError(true);
                    setTimeout(() => setIsDateInputError(false), 5000);
                    return;
                }
            }
            setLoading(true);

            // Определяем цвет на основе типа поста
            const color = (() => {
                switch (postType) {
                    case 'info':
                        return '#3498db';
                    case 'rubric':
                        return '#2ecc71';
                    case 'challenge':
                        return '#e67e22';
                    case 'update':
                        return '#f1c40f';
                    default:
                        return '#3498db';
                }
            })();

            // Очищаем и нормализуем HTML для Telegram
            let normalizedHtml = prepareTelegramHtml(formData.content);

            console.log("normalizedHtml", normalizedHtml);

            const preparedData = await postService.preparePostData(
                { ...formData, content: normalizedHtml, contentHtml: normalizedHtml },
                color,
                scheduledDate
            );

            await postService.createPost(preparedData);

            // Показываем уведомление в зависимости от типа публикации
            if (isScheduled) {
                showNotification('Пост поставлен в очередь', 'success');
            } else {
                showNotification('Пост успешно опубликован', 'success');
            }

            setFormData({
                title: '',
                content: '',
                contentHtml: '',
                image: null,
            });
            setImagePreview(null);
            localStorage.removeItem('postDraft');
            if (formattedTextAreaRef.current) {
                formattedTextAreaRef.current.innerHTML = '';
            }
        } catch (err) {
            showNotification('Ошибка публикации', 'error');
            setError('Ошибка при сохранении поста');
            console.error('Ошибка при сохранении поста:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormatText = (format) => {
        const editor = document.querySelector('[contenteditable="true"]');
        const selection = window.getSelection();

        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return;

        switch (format) {
            case 'bold':
                document.execCommand('bold', false);
                break;
            case 'italic':
                document.execCommand('italic', false);
                break;
            case 'underline':
                document.execCommand('underline', false);
                break;
            case 'strikethrough':
                document.execCommand('strikethrough', false);
                break;
            case 'link':
                setShowLinkModal(true);
                return;
            default:
                break;
        }

        // Обновляем состояние после форматирования
        const value = editor.innerHTML;
        setFormData({
            ...formData,
            content: value,
            contentHtml: value
        });

        // Восстанавливаем фокус на редакторе
        editor.focus();
    };

    const handleEmojiClick = (emoji) => {
        const editableDiv = formattedTextAreaRef.current;
        if (!editableDiv) return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        // Вставляем смайлик
        const emojiNode = document.createTextNode(emoji);
        range.insertNode(emojiNode);
        // Перемещаем курсор после смайлика
        range.setStartAfter(emojiNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        // Обновляем состояние
        setFormData(prev => ({
            ...prev,
            content: editableDiv.innerHTML,
            contentHtml: editableDiv.innerHTML
        }));
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handlePreviewClick = () => {
        setShowPreviewModal(true);
    };

    const handleClosePreview = () => {
        setShowPreviewModal(false);
    };

    const handleLinkSubmit = (e) => {
        e.preventDefault();

        if (!linkText.trim() || !linkUrl.trim()) {
            return;
        }

        const textarea = document.getElementById('content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const selectedText = text.substring(start, end);

        // Используем выбранный текст, если он есть, иначе используем введенный текст ссылки
        const linkDisplayText = selectedText || linkText;
        const formattedText = `<a href="${linkUrl}" target="_blank">${linkDisplayText}</a>`;

        const newText = text.substring(0, start) + formattedText + text.substring(end);
        const newHtmlText = newText.replace(/\n/g, '<br>');

        setFormData({
            ...formData,
            content: newText,
            contentHtml: newHtmlText
        });

        // Закрываем модальное окно и сбрасываем поля
        setShowLinkModal(false);
        setLinkText('');
        setLinkUrl('');

        // Устанавливаем фокус обратно на текстовое поле
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
        }, 0);
    };

    const handleCloseLinkModal = () => {
        setShowLinkModal(false);
        setLinkText('');
        setLinkUrl('');
    };

    const handleFetchChannelPosts = async () => {
        try {
            setLoading(true);
            const posts = await postService.getPostsFromChannel();
            setPosts(posts);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('Ошибка при получении постов с канала');
            console.error('Ошибка при получении постов с канала:', err);
            setLoading(false);
        }
    };

    // Функция фильтрации по дате
    const filterPostsByDate = (posts) => {
        if (!startDate && !endDate) return posts;

        return posts.filter(post => {
            const postDate = new Date(post.date_publish);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && end) {
                return postDate >= start && postDate <= end;
            } else if (start) {
                return postDate >= start;
            } else if (end) {
                return postDate <= end;
            }
            return true;
        });
    };

    // Обновляем фильтрацию при изменении дат или постов
    useEffect(() => {
        const filtered = filterPostsByDate(posts);
        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [posts, startDate, endDate]);

    // Вычисление пагинации
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Загрузка хештегов из localStorage при монтировании компонента
    useEffect(() => {
        const savedHashtags = localStorage.getItem('hashtags');
        if (savedHashtags) {
            setHashtags(JSON.parse(savedHashtags));
        }
    }, []);

    const handleHashtagSubmit = (e) => {
        e.preventDefault();
        if (hashtagInput.trim()) {
            const newHashtag = hashtagInput.trim().startsWith('#')
                ? hashtagInput.trim()
                : `#${hashtagInput.trim()}`;

            if (!hashtags.includes(newHashtag)) {
                const updatedHashtags = [...hashtags, newHashtag];
                setHashtags(updatedHashtags);
                localStorage.setItem('hashtags', JSON.stringify(updatedHashtags));
            }

            setHashtagInput('');
            setShowHashtagModal(false);
        }
    };

    const handleRemoveHashtag = (hashtagToRemove) => {
        const updatedHashtags = hashtags.filter(hashtag => hashtag !== hashtagToRemove);
        setHashtags(updatedHashtags);
        localStorage.setItem('hashtags', JSON.stringify(updatedHashtags));
    };

    const handleCloseHashtagModal = () => {
        setShowHashtagModal(false);
        setHashtagInput('');
    };

    const handleHashtagClick = (hashtag, e) => {
        e.preventDefault();
        e.stopPropagation();

        const editor = document.querySelector('[contenteditable="true"]');
        if (!editor) return;

        // Добавляем пробел перед хештегом, если текст не пустой
        const spaceBefore = editor.textContent.length > 0 ? ' ' : '';

        // Вставляем хештег в конец текста
        const textNode = document.createTextNode(spaceBefore + hashtag);
        editor.appendChild(textNode);

        // Обновляем состояние
        const value = editor.innerHTML;
        setFormData({
            ...formData,
            content: value,
            contentHtml: value
        });

        // Восстанавливаем фокус на редакторе
        editor.focus();
    };

    const updateDropdownPosition = () => {
        if (textareaRef.current && dropdownRef.current) {
            const textarea = textareaRef.current;
            const cursorPosition = textarea.selectionStart;

            // Создаем временный span для измерения позиции
            const tempSpan = document.createElement('span');
            tempSpan.textContent = textarea.value.substring(0, cursorPosition);
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'pre-wrap';
            tempSpan.style.width = textarea.clientWidth + 'px';
            tempSpan.style.font = window.getComputedStyle(textarea).font;
            tempSpan.style.padding = window.getComputedStyle(textarea).padding;
            tempSpan.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
            tempSpan.style.wordWrap = 'break-word';
            tempSpan.style.overflowWrap = 'break-word';

            // Добавляем span в контейнер текстового поля для правильного позиционирования
            const textareaContainer = textarea.parentElement;
            textareaContainer.style.position = 'relative';
            textareaContainer.appendChild(tempSpan);

            // Получаем позицию курсора
            const rect = tempSpan.getBoundingClientRect();
            const textareaRect = textarea.getBoundingClientRect();

            // Учитываем прокрутку контейнера
            const containerScrollTop = textareaContainer.scrollTop;
            const containerScrollLeft = textareaContainer.scrollLeft;

            // Вычисляем позицию относительно текстового поля
            const cursorTop = rect.top - textareaRect.top + containerScrollTop + rect.height;
            const cursorLeft = rect.left - textareaRect.left + containerScrollLeft;

            textareaContainer.removeChild(tempSpan);

            setDropdownPosition({
                top: cursorTop,
                left: cursorLeft
            });
        }
    };

    // Обновляем позицию при изменении текста или позиции курсора
    useEffect(() => {
        if (showUserMentionDropdown) {
            updateDropdownPosition();
            window.addEventListener('resize', updateDropdownPosition);
            window.addEventListener('scroll', updateDropdownPosition);

            // Добавляем обработчик изменения текста
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.addEventListener('input', updateDropdownPosition);
                textarea.addEventListener('click', updateDropdownPosition);
                textarea.addEventListener('keyup', updateDropdownPosition);
            }
        }

        return () => {
            window.removeEventListener('resize', updateDropdownPosition);
            window.removeEventListener('scroll', updateDropdownPosition);

            const textarea = textareaRef.current;
            if (textarea) {
                textarea.removeEventListener('input', updateDropdownPosition);
                textarea.removeEventListener('click', updateDropdownPosition);
                textarea.removeEventListener('keyup', updateDropdownPosition);
            }
        };
    }, [showUserMentionDropdown]);

    // Добавим обработчик клавиш в useEffect
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Если нажата клавиша Backspace и нет выбранного пользователя
            if (e.key === 'Backspace' && !userMentionInput) {
                // Позволяем событию продолжить в TextArea
                return;
            }

            // Если нажата клавиша Escape, скрываем выпадающий список
            if (e.key === 'Escape') {
                setShowUserMentionDropdown(false);
                return;
            }

            // Если нажата клавиша Enter и есть выбранный пользователь
            if (e.key === 'Enter' && filteredUsers.length > 0) {
                e.preventDefault();
                handleUserSelect(filteredUsers[0]);
                return;
            }

            // Для остальных клавиш позволяем событию продолжить
        };

        if (showUserMentionDropdown) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showUserMentionDropdown, userMentionInput, filteredUsers]);

    useEffect(() => {
        if (showPreviewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPreviewModal]);

    const handleFormattedInput = (e) => {
        const value = e.currentTarget.innerHTML;

        // --- UserMentionDropdown logic for contentEditable ---
        const editableDiv = e.currentTarget;
        const textBeforeCursor = getTextBeforeCursor(editableDiv);
        const cursorPos = textBeforeCursor.length;
        const isAtSymbolJustTyped = textBeforeCursor[cursorPos - 1] === '@';
        if (isAtSymbolJustTyped) {
            setShowUserMentionDropdown(true);
            setUserMentionInput('');
            setFilteredUsers(users);
            const sel = window.getSelection();
            if (sel.rangeCount) {
                mentionRangeRef.current = sel.getRangeAt(0).cloneRange();
            }
        } else if (showUserMentionDropdown) {
            const lastAtPos = textBeforeCursor.lastIndexOf('@');
            if (lastAtPos !== -1) {
                const searchText = textBeforeCursor.substring(lastAtPos + 1, cursorPos).toLowerCase();
                setUserMentionInput(searchText);
                const filtered = users.filter(user => {
                    const username = user.username || '';
                    const fullName = user.full_name || '';
                    return username.toLowerCase().includes(searchText) ||
                        fullName.toLowerCase().includes(searchText);
                });
                setFilteredUsers(filtered);
            } else {
                setShowUserMentionDropdown(false);
                setUserMentionInput('');
                setFilteredUsers([]);
            }
        }

        // После всей логики — обновляем состояние и черновик
        setFormData(prev => {
            const updated = {
                ...prev,
                content: value,
                contentHtml: value
            };
            if (isDraftLoaded) {
                localStorage.setItem('postDraft', JSON.stringify({
                    title: updated.title,
                    content: updated.content
                }));
            }
            return updated;
        });
    };

    // Вставка username в contentEditable
    const handleUserSelect = (user) => {
        const editableDiv = formattedTextAreaRef.current;
        if (!editableDiv) return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        // Найдём последнее вхождение @ до курсора
        const textBeforeCursor = getTextBeforeCursor(editableDiv);
        const lastAtPos = textBeforeCursor.lastIndexOf('@');
        if (lastAtPos !== -1) {
            // Удаляем текст после @ до курсора
            range.setStart(editableDiv.firstChild || editableDiv, lastAtPos + 1);
            range.deleteContents();
            // Вставляем username
            const mentionNode = document.createTextNode(user.telegram_username);
            range.insertNode(mentionNode);
            // Перемещаем курсор после вставленного username
            range.setStartAfter(mentionNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            // Обновляем состояние
            setFormData({
                ...formData,
                content: editableDiv.innerHTML,
                contentHtml: editableDiv.innerHTML
            });
            if (!mentionedUsers.some(u => u.id === user.id)) {
                setMentionedUsers([...mentionedUsers, user]);
            }
            setShowUserMentionDropdown(false);
            setUserMentionInput('');
            setFilteredUsers([]);
        }
    };

    // Добавляю мобильную карточку для поста
    const MobilePostCard = styled.div`
        display: none;
        @media (max-width: 768px) {
            display: flex;
            flex-direction: column;
            padding: 12px 8px;
            border-bottom: 1px solid #e9ecef;
            background: white;
        }
    `;

    const MobilePostTitle = styled.a`
        font-weight: 600;
        font-size: 15px;
        color: #3498db;
        text-decoration: none;
        margin-bottom: 6px;
        word-break: break-word;
        &:hover {
            text-decoration: underline;
        }
        &.deleted {
            color: #aaa;
            text-decoration: line-through;
            pointer-events: none;
            cursor: default;
        }
    `;

    const MobilePostInfoRow = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const MobilePostDate = styled.span`
        color: #888;
        font-size: 12px;
    `;

    const MobilePostStats = styled.div`
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        color: #888;
    `;

    const MobileStat = styled.span`
        display: flex;
        align-items: center;
        gap: 4px;
    `;

    return (
        <Container>
            <NewPostRow>
                <NewPostContainer $postType={postType}>
                    <TitleContainer>
                        <Title>Новый пост</Title>
                        <SelectWrapper>
                            <PostTypeSelect
                                value={postType}
                                onChange={(e) => setPostType(e.target.value)}
                            >
                                <PostTypeOption value="info">Инфо</PostTypeOption>
                                <PostTypeOption value="rubric">Рубрика</PostTypeOption>
                                <PostTypeOption value="challenge">Челлендж</PostTypeOption>
                                <PostTypeOption value="update">Обновление</PostTypeOption>
                            </PostTypeSelect>
                            <FaChevronDown size={14} />
                        </SelectWrapper>
                        <ScheduledPostContainer>
                            <CheckboxLabel>
                                <Checkbox
                                    type="checkbox"
                                    checked={isScheduled}
                                    onChange={(e) => setIsScheduled(e.target.checked)}
                                />
                                Отложенный пост
                            </CheckboxLabel>
                            {isScheduled && (
                                <DateTimeInput
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    min={getCurrentDateTimeLocal()}
                                    $error={isDateInputError}
                                />
                            )}
                        </ScheduledPostContainer>
                    </TitleContainer>
                    <FormContent>
                        <FormGroup>
                            <Label htmlFor="title">Заголовок</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Введите заголовок поста"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="content">Текст поста</Label>
                            <FormattingToolbar>
                                <FormatButton onClick={() => handleFormatText('bold')} title="Жирный">
                                    <strong>B</strong>
                                </FormatButton>
                                <FormatButton onClick={() => handleFormatText('italic')} title="Курсив">
                                    <em>I</em>
                                </FormatButton>
                                <FormatButton onClick={() => handleFormatText('underline')} title="Подчеркнутый">
                                    <u>U</u>
                                </FormatButton>
                                <FormatButton onClick={() => handleFormatText('strikethrough')} title="Зачеркнутый">
                                    <s>S</s>
                                </FormatButton>
                                <Divider />
                                <FormatButton onClick={() => handleFormatText('link')} title="Добавить ссылку">
                                    <FaLink size={14} />
                                </FormatButton>
                                <Divider />
                                <EmojiPickerButton onClick={toggleEmojiPicker} title="Добавить смайлик" ref={emojiPickerRef}>
                                    😊
                                    {showEmojiPicker && (
                                        <EmojiPickerDropdown>
                                            {emojis.map((emoji, index) => (
                                                <EmojiItem key={index} onClick={() => handleEmojiClick(emoji)}>
                                                    {emoji}
                                                </EmojiItem>
                                            ))}
                                        </EmojiPickerDropdown>
                                    )}
                                </EmojiPickerButton>
                                <HashtagButton onClick={() => setShowHashtagModal(true)}>
                                    + Хештег
                                </HashtagButton>
                            </FormattingToolbar>
                            <TextAreaContainer>
                                <FormattedTextArea
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={handleFormattedInput}
                                    onBlur={(e) => {
                                        const value = e.currentTarget.innerHTML;
                                        setFormData({
                                            ...formData,
                                            content: value,
                                            contentHtml: value
                                        });
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text/plain');
                                        document.execCommand('insertText', false, text);
                                    }}
                                    ref={formattedTextAreaRef}
                                />
                                <ImageActions>
                                    <ImageUploadButton htmlFor="image">
                                        Загрузить изображение
                                    </ImageUploadButton>
                                    <HiddenFileInput
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <>
                                            <DeleteImageButton onClick={handleRemoveImage} title="Удалить изображение">
                                                <FaTrash size={16} />
                                            </DeleteImageButton>
                                            <ImagePreview>
                                                <ImagePreviewImg src={imagePreview} alt="Preview" />
                                            </ImagePreview>
                                        </>
                                    )}
                                </ImageActions>
                                <HashtagContainer>
                                    {hashtags.map((hashtag, index) => (
                                        <HashtagItem
                                            key={index}
                                            onClick={(e) => handleHashtagClick(hashtag, e)}
                                        >
                                            {hashtag}
                                            <HashtagRemoveButton
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemoveHashtag(hashtag);
                                                }}
                                            >
                                                ×
                                            </HashtagRemoveButton>
                                        </HashtagItem>
                                    ))}
                                </HashtagContainer>
                                {showUserMentionDropdown && (
                                    <UserMentionDropdown
                                        ref={dropdownRef}
                                        $show={showUserMentionDropdown}
                                    >
                                        <UserMentionSearch
                                            type="text"
                                            placeholder="Поиск пользователей..."
                                            value={userMentionInput}
                                            onChange={(e) => setUserMentionInput(e.target.value)}
                                        />
                                        <UserMentionListWrapper>
                                            {loading ? (
                                                <UserMentionItem>Загрузка пользователей...</UserMentionItem>
                                            ) : error ? (
                                                <UserMentionItem>Ошибка загрузки пользователей</UserMentionItem>
                                            ) : filteredUsers && filteredUsers.length > 0 ? (
                                                filteredUsers.map(user => (
                                                    <UserMentionItem
                                                        key={user.id}
                                                        onMouseDown={e => { e.preventDefault(); handleUserSelectCE(user); }}
                                                    >
                                                        <UserAvatar>
                                                            {user.fio && user.fio.charAt(0).toUpperCase()}
                                                        </UserAvatar>
                                                        <UserInfo>
                                                            <UserName>
                                                                {user.fio || 'Без имени'}
                                                                {user.is_verified && <VerifiedBadge>✓</VerifiedBadge>}
                                                            </UserName>
                                                            <UserUsername>@{user.telegram_username || 'username'}</UserUsername>
                                                        </UserInfo>
                                                    </UserMentionItem>
                                                ))
                                            ) : (
                                                <UserMentionItem>Нет доступных пользователей</UserMentionItem>
                                            )}
                                        </UserMentionListWrapper>
                                    </UserMentionDropdown>
                                )}
                            </TextAreaContainer>
                        </FormGroup>
                    </FormContent>
                    <ButtonContainer>
                        <PublishButton onClick={handlePublish}>
                            <FaPaperPlane size={14} />
                            Опубликовать
                        </PublishButton>
                        <PreviewButton onClick={handlePreviewClick}>
                            <FaEye size={14} />
                            Предпросмотр
                        </PreviewButton>
                        <ResetDraftButton onClick={handleResetDraft} title="Сбросить черновик">
                            <FaUndo size={14} />
                        </ResetDraftButton>
                    </ButtonContainer>
                </NewPostContainer>
            </NewPostRow>
            <PostsTableContainer>
                <TableHeaderContainer>
                    <Title>Посты</Title>
                    <FetchPostsButton onClick={handleFetchChannelPosts}>
                        <FaSync style={{ marginRight: 8 }} />
                        Синхронизировать посты с канала
                    </FetchPostsButton>
                </TableHeaderContainer>
                <FilterContainer>
                    <DateFilter>
                        <FilterLabel>Период:</FilterLabel>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <FilterLabel>—</FilterLabel>
                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        {(startDate || endDate) && (
                            <ClearPeriodButton
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                title="Очистить период"
                            >
                                ×
                            </ClearPeriodButton>
                        )}
                    </DateFilter>
                </FilterContainer>
                {loading && <LoadingSpinner>Загрузка...</LoadingSpinner>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <TableWrapper>
                    {/* Desktop table */}
                    <Table className="desktop-table">
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Дата публикации</TableHeaderCell>
                                <TableHeaderCell>Заголовок</TableHeaderCell>
                                <TableHeaderCell>Просмотры</TableHeaderCell>
                                <TableHeaderCell>Лайки</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {currentPosts.map(post => {
                                const isScheduled = new Date(post.date_publish) > new Date();
                                return (
                                    <TableRow
                                        key={post.id}
                                        $isDeleted={post.is_deleted}
                                        $isScheduled={isScheduled}
                                    >
                                        <TableCell>{new Date(post.date_publish).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <PostLink href={post.link_telegram} target="_blank" rel="noopener noreferrer">
                                                {post.title}
                                            </PostLink>
                                        </TableCell>
                                        <TableCell>{post.views}</TableCell>
                                        <TableCell>{post.likes}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </tbody>
                    </Table>
                    {/* Mobile cards */}
                    <MobileTable>
                        {currentPosts.map(post => (
                            <MobilePostCard key={post.id}>
                                {post.is_deleted ? (
                                    <MobilePostTitle as="div" className="deleted">
                                        {post.title}
                                    </MobilePostTitle>
                                ) : (
                                    <MobilePostTitle href={post.link_telegram} target="_blank" rel="noopener noreferrer">
                                        {post.title}
                                    </MobilePostTitle>
                                )}
                                <MobilePostInfoRow>
                                    <MobilePostDate>{new Date(post.date_publish).toLocaleDateString()}</MobilePostDate>
                                    <MobilePostStats>
                                        <MobileStat><FaEye size={13} /> {post.views}</MobileStat>
                                        <MobileStat><FaHeart size={13} /> {post.likes}</MobileStat>
                                    </MobilePostStats>
                                </MobilePostInfoRow>
                            </MobilePostCard>
                        ))}
                    </MobileTable>
                </TableWrapper>
                {totalPages > 1 && (
                    <PaginationContainer>
                        <PageButton
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </PageButton>
                        <PageButton
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </PageButton>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                if (totalPages <= 5) return true;
                                if (page === 1 || page === totalPages) return true;
                                if (Math.abs(page - currentPage) <= 1) return true;
                                return false;
                            })
                            .map((page, index, array) => {
                                if (index > 0 && array[index - 1] !== page - 1) {
                                    return (
                                        <React.Fragment key={`ellipsis-${page}`}>
                                            <span>...</span>
                                            <PageButton
                                                $active={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </PageButton>
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <PageButton
                                        key={page}
                                        $active={currentPage === page}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </PageButton>
                                );
                            })}
                        <PageButton
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </PageButton>
                        <PageButton
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </PageButton>
                    </PaginationContainer>
                )}
            </PostsTableContainer>

            {showPreviewModal && (
                <ModalOverlay onClick={handleClosePreview}>
                    <ModalContent onClick={(e) => e.stopPropagation()} $isDarkMode={isDarkMode}>
                        <ModalHeader $isDarkMode={isDarkMode}>
                            <ModalTitle $isDarkMode={isDarkMode}>Предпросмотр поста в Telegram</ModalTitle>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ThemeToggleButton
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    $isDarkMode={isDarkMode}
                                    title={isDarkMode ? "Переключить на светлую тему" : "Переключить на темную тему"}
                                >
                                    {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                                </ThemeToggleButton>
                                <CloseButton onClick={handleClosePreview} $isDarkMode={isDarkMode}>
                                    &times;
                                </CloseButton>
                            </div>
                        </ModalHeader>
                        <PreviewPostContainer $isDarkMode={isDarkMode}>
                            <PreviewWrapper>
                                <TelegramPostCard $isDarkMode={isDarkMode}>
                                    {imagePreview && (
                                        <TelegramPostImage src={imagePreview} alt="Изображение поста" $postType={postType} />
                                    )}
                                    {formData.title && (
                                        <TelegramPostTitle $isDarkMode={isDarkMode}>{formData.title}</TelegramPostTitle>
                                    )}
                                    <TelegramPostContent
                                        $isDarkMode={isDarkMode}
                                        dangerouslySetInnerHTML={{ __html: formData.contentHtml || 'Текст поста отсутствует' }}
                                    />
                                    <TelegramPostFooter>
                                        <ClockIcon />
                                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </TelegramPostFooter>
                                </TelegramPostCard>
                            </PreviewWrapper>
                        </PreviewPostContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Модальное окно для добавления ссылки */}
            {showLinkModal && (
                <>
                    <LinkModalOverlay onClick={handleCloseLinkModal} />
                    <LinkModal onClick={(e) => e.stopPropagation()}>
                        <LinkModalHeader>
                            <LinkModalTitle>Добавить ссылку</LinkModalTitle>
                            <LinkModalCloseButton onClick={handleCloseLinkModal}>&times;</LinkModalCloseButton>
                        </LinkModalHeader>
                        <LinkModalForm onSubmit={handleLinkSubmit}>
                            <div>
                                <Label htmlFor="link-text">Текст ссылки</Label>
                                <LinkModalInput
                                    type="text"
                                    id="link-text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Введите текст ссылки"
                                />
                            </div>
                            <div>
                                <Label htmlFor="link-url">URL</Label>
                                <LinkModalInput
                                    type="url"
                                    id="link-url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <LinkModalButtons>
                                <LinkModalCancelButton type="button" onClick={handleCloseLinkModal}>
                                    Отмена
                                </LinkModalCancelButton>
                                <LinkModalSubmitButton type="submit">
                                    Добавить
                                </LinkModalSubmitButton>
                            </LinkModalButtons>
                        </LinkModalForm>
                    </LinkModal>
                </>
            )}

            {showHashtagModal && (
                <>
                    <HashtagModalOverlay onClick={handleCloseHashtagModal} />
                    <HashtagModal onClick={(e) => e.stopPropagation()}>
                        <HashtagModalHeader>
                            <HashtagModalTitle>Добавить хештег</HashtagModalTitle>
                            <HashtagModalCloseButton onClick={handleCloseHashtagModal}>
                                &times;
                            </HashtagModalCloseButton>
                        </HashtagModalHeader>
                        <HashtagModalForm onSubmit={handleHashtagSubmit}>
                            <HashtagModalInput
                                type="text"
                                value={hashtagInput}
                                onChange={(e) => setHashtagInput(e.target.value)}
                                placeholder="Введите хештег"
                                autoFocus
                            />
                            <HashtagModalButtons>
                                <HashtagModalCancelButton type="button" onClick={handleCloseHashtagModal}>
                                    Отмена
                                </HashtagModalCancelButton>
                                <HashtagModalSubmitButton type="submit">
                                    Добавить
                                </HashtagModalSubmitButton>
                            </HashtagModalButtons>
                        </HashtagModalForm>
                    </HashtagModal>
                </>
            )}
        </Container>
    );
};

export default PostsPage;