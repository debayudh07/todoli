"use client"

import { useState, useEffect } from 'react'
import { Plus, X, Search, Edit2, Check, Calendar, Flag, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Priority = 'low' | 'medium' | 'high'
type Category = 'work' | 'personal' | 'shopping' | 'other'

interface Todo {
  id: number
  text: string
  completed: boolean
  dueDate: string
  priority: Priority
  category: Category
}

const priorities: Priority[] = ['low', 'medium', 'high']
const categories: Category[] = ['work', 'personal', 'shopping', 'other']

export default function CardBasedTodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [newTodoDueDate, setNewTodoDueDate] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('medium')
  const [newTodoCategory, setNewTodoCategory] = useState<Category>('personal')

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        dueDate: newTodoDueDate,
        priority: newTodoPriority,
        category: newTodoCategory,
      }
      setTodos([...todos, newTodoItem])
      setNewTodo('')
      setNewTodoDueDate('')
      setNewTodoPriority('medium')
      setNewTodoCategory('personal')
    }
  }

  const updateTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ))
    setEditingId(null)
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority === 'all' || todo.priority === filterPriority) &&
    (filterCategory === 'all' || todo.category === filterCategory)
  )

  const completedPercentage = (todos.filter(todo => todo.completed).length / todos.length) * 100 || 0

  const priorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
    }
  }

  const categoryColor = (category: Category) => {
    switch (category) {
      case 'work': return 'bg-blue-500'
      case 'personal': return 'bg-purple-500'
      case 'shopping': return 'bg-pink-500'
      case 'other': return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-purple-400 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Card-Based Todo List</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Todo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Enter todo text"
                  className="w-full bg-gray-800 text-purple-400 placeholder-purple-300"
                />
                <Input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="w-full bg-gray-800 text-purple-400"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Flag className="mr-2 h-4 w-4" />
                      {newTodoPriority}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <Command>
                      <CommandInput placeholder="Change priority..." />
                      <CommandEmpty>No priority found.</CommandEmpty>
                      <CommandGroup>
                        {priorities.map((priority) => (
                          <CommandItem key={priority} onSelect={() => setNewTodoPriority(priority)}>
                            <Check
                              className={`mr-2 h-4 w-4 ${newTodoPriority === priority ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <Badge className={`mr-2 ${priorityColor(priority)}`}>{priority}</Badge>
                            {priority}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Flag className="mr-2 h-4 w-4" />
                      {newTodoCategory}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <Command>
                      <CommandInput placeholder="Change category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem key={category} onSelect={() => setNewTodoCategory(category)}>
                            <Check
                              className={`mr-2 h-4 w-4 ${newTodoCategory === category ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <Badge className={`mr-2 ${categoryColor(category)}`}>{category}</Badge>
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button onClick={addTodo} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 w-4 h-4" /> Add Todo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Search and Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search todos..."
                    className="w-full pl-10 bg-gray-800 text-purple-400 placeholder-purple-300"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {(filterPriority !== 'all' || filterCategory !== 'all') && (
                        <Badge variant="secondary" className="ml-2 bg-purple-500">!</Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Priority</h4>
                        <Command>
                          <CommandInput placeholder="Filter priorities..." />
                          <CommandEmpty>No priority found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem onSelect={() => setFilterPriority('all')}>
                              <Check
                                className={`mr-2 h-4 w-4 ${filterPriority === 'all' ? 'opacity-100' : 'opacity-0'}`}
                              />
                              All
                            </CommandItem>
                            {priorities.map((priority) => (
                              <CommandItem key={priority} onSelect={() => setFilterPriority(priority)}>
                                <Check
                                  className={`mr-2 h-4 w-4 ${filterPriority === priority ? 'opacity-100' : 'opacity-0'}`}
                                />
                                <Badge className={`mr-2 ${priorityColor(priority)}`}>{priority}</Badge>
                                {priority}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Category</h4>
                        <Command>
                          <CommandInput placeholder="Filter categories..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem onSelect={() => setFilterCategory('all')}>
                              <Check
                                className={`mr-2 h-4 w-4 ${filterCategory === 'all' ? 'opacity-100' : 'opacity-0'}`}
                              />
                              All
                            </CommandItem>
                            {categories.map((category) => (
                              <CommandItem key={category} onSelect={() => setFilterCategory(category)}>
                                <Check
                                  className={`mr-2 h-4 w-4 ${filterCategory === category ? 'opacity-100' : 'opacity-0'}`}
                                />
                                <Badge className={`mr-2 ${categoryColor(category)}`}>{category}</Badge>
                                {category}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completedPercentage} className="w-full" />
              <p className="mt-2 text-center">{completedPercentage.toFixed(0)}% Complete</p>
            </CardContent>
          </Card>

          {/* Todo List Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Todo List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <ul className="space-y-2">
                  {filteredTodos.map((todo) => (
                    <li
                      key={todo.id}
                      className={`flex items-center justify-between bg-gray-800 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-700 ${
                        todo.completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2 flex-grow">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleComplete(todo.id)}
                          className="border-purple-400 text-purple-600"
                        />
                        {editingId === todo.id ? (
                          <Input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-grow bg-gray-700 text-purple-400"
                          />
                        ) : (
                          <span className={`flex-grow ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm"><Calendar className="w-4 h-4 inline mr-1" />{todo.dueDate}</span>
                        <Badge className={priorityColor(todo.priority)}>{todo.priority}</Badge>
                        <Badge className={categoryColor(todo.category)}>{todo.category}</Badge>
                        {editingId === todo.id ? (
                          <Button
                            onClick={() => updateTodo(todo.id)}
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-200 hover:bg-green-800 rounded-full transition-colors duration-300"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setEditingId(todo.id)
                              setEditText(todo.text)
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-yellow-400 hover:text-yellow-200 hover:bg-yellow-800 rounded-full transition-colors duration-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-200 hover:bg-red-800 rounded-full transition-colors duration-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}