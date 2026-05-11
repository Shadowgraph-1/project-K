import EmptySession from "./EmptySession";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/shared/ui/avatar";

function TeamSession() {
  return (
    <div>
        <div>
      <EmptySession
        titleName="Работай в команде"
        descriptionName="Добавь друзей"
        icon={<AvatarGroup className="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>}
        buttonName="Пригласить"
      />
        </div>
    </div>
  );
}

export default TeamSession;
