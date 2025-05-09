import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execPromise = promisify(exec);

// Xác định thư mục `uploads` trong project
const uploadDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "uploads"
);

export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        if (!code) throw new Error("No code provided!");

        const response = await fetch("https://godbolt.org/api/compiler/g120/compile", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                source: code,
                compiler: "g120",  // GCC 12.0
                options: { executorRequest: true }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Debug lỗi từ server
            throw new Error(`Compiler API Error: ${errorText}`);
        }

        const data = await response.json();

        return NextResponse.json({ output: data.stdout || "No output" });
    } catch (error) {
        return NextResponse.json({ output: "Server Error:\n" + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
