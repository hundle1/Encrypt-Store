import { CalendarDays, Copyright } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import Button from "./ui/button"

export function HoverCardInfor() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="mt-1 cursor-default">Copy Right</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <div className=" flex align-middle justify-center flex-wrap ">
                        <Avatar>
                            <AvatarImage src="https://github.com/vercel.png" />
                            <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <p className="w-full h-full text-center">Power by NextJS</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Stack Market</h4>
                        <p className="text-sm">
                            Cung cấp dịch vụ và nền tảng cho sản phẩm của bạn
                        </p>
                        <div className="flex items-center pt-2">
                            <Copyright className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                CopyRight to VietFuture
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
