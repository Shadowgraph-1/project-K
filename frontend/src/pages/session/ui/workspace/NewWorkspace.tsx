import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useWorkspaceStore } from "@/entities/workspace/model/useWorkspaceStore"

function NewWorkspace() {
  const [title, setTitle] = useState("")
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace)
  const navigate = useNavigate()

  function handleCreate() {
    if (!title.trim()) return
    addWorkspace({
      id: `workspace-${Date.now()}`,
      title,
      hint: "",
    })
    navigate("/session")
  }

  return (
    <div className="mx-auto max-w-sm p-6 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-lg font-medium">Добро пожаловать</h2>
        <p className="text-sm text-muted-foreground">Создайте свою рабочую область</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          placeholder="Например: Диплом, Работа..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
      </div>

      <Button onClick={handleCreate} disabled={!title.trim()}>
        Создать
      </Button>
    </div>
  )
}

export default NewWorkspace