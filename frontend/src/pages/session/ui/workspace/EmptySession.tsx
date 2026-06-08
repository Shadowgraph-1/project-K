import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "@/shared/ui/empty"

import { Button } from "@/shared/ui/button";
import type { ReactNode } from "react";

type EmptyProps = {
    titleName?: string;
    descriptionName?: string;
    action?: () => void
    icon?: ReactNode;
    buttonName?: string 
}




function EmptySession ({ titleName, descriptionName, action, icon, buttonName }: EmptyProps) {


    return (

        <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {icon}
          </EmptyMedia>
          <EmptyTitle>{titleName}</EmptyTitle>
          <EmptyDescription>{descriptionName}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
          onClick={action}
          >{buttonName}</Button>
        </EmptyContent>
        </Empty>

    )
}



export default EmptySession;