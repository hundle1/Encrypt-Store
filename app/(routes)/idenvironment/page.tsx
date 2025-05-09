'use client';
import { File, FolderClosed, ChevronDown, ChevronRight, Sun, Moon, Play, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Resizable } from 're-resizable';
import Button from '@/components/ui/button';

export default function IDEPage() {
    const [files, setFiles] = useState<{ [key: string]: { name?: string; language?: string; content: string } }>({});
    const [folders, setFolders] = useState<Record<string, string[]>>({});
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [openTabs, setOpenTabs] = useState<string[]>([]);
    const [output, setOutput] = useState('');
    const [sidebarWidth, setSidebarWidth] = useState(200);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [tempName, setTempName] = useState('');
    const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

    // State cho context menu
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; type: 'file' | 'folder' | null; item: string | null; }>({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        item: null,
    });

    const handleRun = async () => {
        if (!currentFile) return;
        setOutput("On compiling...");
        try {
            const response = await fetch("http://localhost:3001/api/run-cpp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: currentFile, code: files[currentFile].content }),
            });
            const data = await response.json();
            setOutput(response.ok ? data.output : "Error:\n" + data.output);
        } catch (error) {
            setOutput("API Error Fetching: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };

    const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            setSelectedFolder(null);
        }
    };

    const commitNewFile = () => {
        if (!tempName.includes('.')) return;
        let filePath = tempName;
        if (selectedFolder) {
            filePath = `${selectedFolder}/${tempName}`;
            const folderFiles = folders[selectedFolder] || [];
            setFolders({ ...folders, [selectedFolder]: [...folderFiles, filePath] });
        }
        setFiles({ ...files, [filePath]: { name: tempName, language: tempName.endsWith('.html') ? 'html' : 'cpp', content: '' } });
        // Mở file mới ở tab nếu chưa có
        if (!openTabs.includes(filePath)) {
            setOpenTabs([...openTabs, filePath]);
        }
        setCurrentFile(filePath);
        setIsCreatingFile(false);
        setTempName('');
    };

    const commitNewFolder = () => {
        if (!tempName) return;
        setFolders({ ...folders, [tempName]: [] });
        setOpenFolders({ ...openFolders, [tempName]: true });
        setSelectedFolder(tempName);
        setIsCreatingFolder(false);
        setTempName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'file' | 'folder') => {
        if (e.key === 'Enter') {
            type === 'file' ? commitNewFile() : commitNewFolder();
        }
    };

    const toggleFolder = (folder: string) => {
        setOpenFolders({ ...openFolders, [folder]: !openFolders[folder] });
        setSelectedFolder(folder);
    };

    const openFileInTab = (file: string) => {
        if (!openTabs.includes(file)) {
            setOpenTabs([...openTabs, file]);
        }
        setCurrentFile(file);
    };

    const closeTab = (file: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTabs = openTabs.filter(tab => tab !== file);
        setOpenTabs(newTabs);
        if (currentFile === file) {
            setCurrentFile(newTabs.length ? newTabs[newTabs.length - 1] : null);
        }
    };

    // Hàm chọn icon cho file dựa theo language
    const getFileIcon = (language?: string) => {
        if (language === 'cpp') {
            return <File size={16} className="text-blue-500" />;
        }
        if (language === 'html') {
            return <File size={16} className="text-orange-500" />;
        }
        return <File size={16} />;
    };

    // Xử lý context menu (chuột phải) cho file và folder
    const handleContextMenu = (e: React.MouseEvent, type: 'file' | 'folder', item: string) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, type, item });
    };

    // Ẩn context menu khi click bên ngoài
    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.visible) {
                setContextMenu({ ...contextMenu, visible: false, type: null, item: null });
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

    // Hàm xử lý rename cho file và folder
    const handleRename = () => {
        if (!contextMenu.item || !contextMenu.type) return;
        const newName = window.prompt("Nhập tên mới:", contextMenu.item);
        if (!newName) return;
        if (contextMenu.type === 'file') {
            // Tính toán file mới dựa trên folder nếu có
            let newFilePath = newName;
            const parts = contextMenu.item.split('/');
            if (parts.length > 1) {
                const folder = parts.slice(0, -1).join('/');
                newFilePath = `${folder}/${newName}`;
            }
            // Cập nhật files
            const newFiles = { ...files };
            newFiles[newFilePath] = { ...newFiles[contextMenu.item], name: newName };
            delete newFiles[contextMenu.item];
            setFiles(newFiles);
            // Cập nhật openTabs và currentFile nếu cần
            setOpenTabs(openTabs.map(tab => (tab === contextMenu.item ? newFilePath : tab)));
            if (currentFile === contextMenu.item) {
                setCurrentFile(newFilePath);
            }
            // Nếu file nằm trong folder, cập nhật lại danh sách file của folder đó
            if (parts.length > 1) {
                const folder = parts[0];
                const folderFiles = folders[folder].map(f => (f === contextMenu.item ? newFilePath : f));
                setFolders({ ...folders, [folder]: folderFiles });
            }
        } else if (contextMenu.type === 'folder') {
            // Đổi tên folder: cập nhật key trong folders, openFolders, và tất cả các file trong folder
            const oldFolderName = contextMenu.item;
            const newFolders = { ...folders };
            newFolders[newName] = newFolders[oldFolderName];
            delete newFolders[oldFolderName];
            setFolders(newFolders);

            const newOpenFolders = { ...openFolders };
            newOpenFolders[newName] = newOpenFolders[oldFolderName];
            delete newOpenFolders[oldFolderName];
            setOpenFolders(newOpenFolders);

            if (selectedFolder === oldFolderName) setSelectedFolder(newName);

            // Cập nhật các file trong folder
            const newFiles = { ...files };
            Object.keys(files).forEach(file => {
                if (file.startsWith(oldFolderName + '/')) {
                    const newFilePath = file.replace(oldFolderName + '/', newName + '/');
                    newFiles[newFilePath] = { ...newFiles[file] };
                    delete newFiles[file];
                    // Cập nhật tab mở
                    setOpenTabs(prev => prev.map(tab => (tab === file ? newFilePath : tab)));
                    if (currentFile === file) {
                        setCurrentFile(newFilePath);
                    }
                }
            });
            setFiles(newFiles);
        }
        setContextMenu({ ...contextMenu, visible: false, type: null, item: null });
    };

    // Hàm xử lý xóa file hoặc folder
    const handleDelete = () => {
        if (!contextMenu.item || !contextMenu.type) return;
        if (contextMenu.type === 'file') {
            if (!window.confirm("Bạn có chắc muốn xóa file này?")) return;
            const newFiles = { ...files };
            delete newFiles[contextMenu.item];
            setFiles(newFiles);
            // Nếu file nằm trong folder, cập nhật danh sách file của folder
            const parts = contextMenu.item.split('/');
            if (parts.length > 1) {
                const folder = parts[0];
                const folderFiles = folders[folder].filter(f => f !== contextMenu.item);
                setFolders({ ...folders, [folder]: folderFiles });
            }
            // Cập nhật openTabs và currentFile
            const newTabs = openTabs.filter(tab => tab !== contextMenu.item);
            setOpenTabs(newTabs);
            if (currentFile === contextMenu.item) {
                setCurrentFile(newTabs.length ? newTabs[newTabs.length - 1] : null);
            }
        } else if (contextMenu.type === 'folder') {
            if (!window.confirm("Bạn có chắc muốn xóa folder này và tất cả file bên trong?")) return;
            const newFolders = { ...folders };
            delete newFolders[contextMenu.item];
            setFolders(newFolders);
            const newOpenFolders = { ...openFolders };
            delete newOpenFolders[contextMenu.item];
            setOpenFolders(newOpenFolders);
            if (selectedFolder === contextMenu.item) setSelectedFolder(null);
            // Xóa tất cả file có key bắt đầu bằng tên folder đó
            const newFiles = { ...files };
            Object.keys(files).forEach(file => {
                if (file.startsWith(contextMenu.item + '/')) {
                    delete newFiles[file];
                    setOpenTabs(prev => prev.filter(tab => tab !== file));
                    if (currentFile === file) {
                        setCurrentFile(null);
                    }
                }
            });
            setFiles(newFiles);
        }
        setContextMenu({ ...contextMenu, visible: false, type: null, item: null });
    };

    return (
        <div className={`flex overflow-hidden h-[780px] ${darkMode ? 'bg-[#0d0d0d] text-white' : 'bg-white text-black'}`}>
            <Resizable
                defaultSize={{ width: sidebarWidth, height: '100%' }}
                minWidth={180}
                maxWidth={300}
                enable={{ right: true }}
                onResizeStop={(e, dir, ref) => setSidebarWidth(ref.offsetWidth)}
            >
                <div
                    className={`h-full ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-3 border-r border-gray-300 flex flex-col`}
                    onClick={handleSidebarClick}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[14px] font-bold">IDE playground</span>
                        <div className="space-x-2 flex items-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreatingFile(true);
                                    setIsCreatingFolder(false);
                                }}
                                className="text-green-500"
                            >
                                <File size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreatingFolder(true);
                                    setIsCreatingFile(false);
                                }}
                                className="text-blue-500"
                            >
                                <FolderClosed size={16} />
                            </button>
                        </div>
                    </div>
                    <ul className="text-sm flex-1 overflow-auto">
                        {Object.keys(folders).map((folder) => (
                            <li key={folder}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFolder(folder);
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, 'folder', folder)}
                                    className={`flex items-center p-1 rounded-md cursor-pointer ${selectedFolder === folder ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                >
                                    {openFolders[folder] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <FolderClosed size={16} className="ml-1" />
                                    <span className="ml-1 font-semibold">{folder}</span>
                                </div>
                                {openFolders[folder] && (
                                    <ul className="pl-4">
                                        {folders[folder].map((file) => (
                                            <li
                                                key={file}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openFileInTab(file);
                                                }}
                                                onContextMenu={(e) => handleContextMenu(e, 'file', file)}
                                                className={`flex items-center cursor-pointer p-1 rounded-md ${currentFile === file ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                            >
                                                {getFileIcon(files[file]?.language)}
                                                <span className="ml-1">{file.split('/').pop()}</span>
                                            </li>
                                        ))}
                                        {isCreatingFile && selectedFolder === folder && (
                                            <li className="pl-4">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={tempName}
                                                    onChange={e => setTempName(e.target.value)}
                                                    onBlur={commitNewFile}
                                                    onKeyDown={e => handleKeyDown(e, 'file')}
                                                    placeholder="Enter file name..."
                                                    className="border p-1 w-full text-xs"
                                                />
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </li>
                        ))}
                        {isCreatingFolder && (
                            <li>
                                <div className="flex items-center p-1 rounded-md bg-gray-200">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={tempName}
                                        onChange={e => setTempName(e.target.value)}
                                        onBlur={commitNewFolder}
                                        onKeyDown={e => handleKeyDown(e, 'folder')}
                                        placeholder="Enter folder name..."
                                        className="border p-1 w-full text-xs"
                                    />
                                </div>
                            </li>
                        )}
                        {Object.keys(files)
                            .filter(file => !file.includes('/'))
                            .map(file => (
                                <li
                                    key={file}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openFileInTab(file);
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, 'file', file)}
                                    className={`flex items-center cursor-pointer p-1 rounded-md ${currentFile === file ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                                >
                                    {getFileIcon(files[file]?.language)}
                                    <span className="ml-1">{file}</span>
                                </li>
                            ))}
                        {isCreatingFile && !selectedFolder && (
                            <li>
                                <input
                                    type="text"
                                    autoFocus
                                    value={tempName}
                                    onChange={e => setTempName(e.target.value)}
                                    onBlur={commitNewFile}
                                    onKeyDown={e => handleKeyDown(e, 'file')}
                                    placeholder="Enter file name..."
                                    className="border p-1 w-full text-xs"
                                />
                            </li>
                        )}
                    </ul>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="mt-2 p-2 rounded-full hover:bg-gray-700 transition-all self-center"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </Resizable>
            <div className="flex flex-col flex-1">
                <div className={`flex items-center justify-between h-7 ${darkMode ? 'bg-[#333]' : 'bg-[#ffffff]'}`}>
                    <div className={`flex space-x-2 px-3 py-5 ${darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'} overflow-x-auto`}>
                        {openTabs.map(file => (
                            <div
                                key={file}
                                onClick={() => setCurrentFile(file)}
                                className={`flex items-center space-x-1 px-2 py-1 rounded border cursor-pointer ${currentFile === file ? 'bg-white shadow' : ''}`}
                            >
                                <span className="text-xs">{files[file]?.name || file}</span>
                                <button onClick={(e) => closeTab(file, e)}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleRun} className="flex items-center space-x-1 h-6 bg-white text-[#007ACC] hover:bg-gray-200 text-sm">
                        <Play size={16} />
                        <span>Run</span>
                    </Button>
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={currentFile && files[currentFile] ? files[currentFile].language : 'plaintext'}
                            value={currentFile && files[currentFile] ? files[currentFile].content : ''}
                            onChange={value => {
                                if (currentFile && files[currentFile]) {
                                    setFiles({ ...files, [currentFile]: { ...files[currentFile], content: value || '' } });
                                }
                            }}
                            theme={darkMode ? 'vs-dark' : 'light'}
                            options={{ minimap: { enabled: false } }}
                        />
                    </div>
                    <div className={`h-32 p-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} overflow-auto`}>
                        {currentFile && files[currentFile].language === 'html' ? (
                            <iframe srcDoc={output} className="w-full h-full" />
                        ) : (
                            <pre className="text-green-500 text-xs">{output}</pre>
                        )}
                    </div>
                </div>
            </div>
            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="absolute bg-white border border-gray-300 shadow z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div
                        onClick={handleRename}
                        className="px-3 py-1 cursor-pointer hover:bg-gray-200 text-sm"
                    >
                        Rename
                    </div>
                    <div
                        onClick={handleDelete}
                        className="px-3 py-1 cursor-pointer hover:bg-gray-200 text-sm"
                    >
                        Delete
                    </div>
                </div>
            )}
        </div>
    );
}
