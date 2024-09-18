"use client"

import { useState, useEffect } from 'react'
import { Plus, X, Search, Edit2, Check,  Flag, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


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

  // Load from local storage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos)
        setTodos(Array.isArray(parsedTodos) ? parsedTodos : [])
      } catch (error) {
        console.error("Error parsing stored todos", error)
        setTodos([]) // Set empty array if parsing fails
      }
    } else {
      setTodos([]) // Ensure todos is an array if nothing is in localStorage
    }
  }, [])
  

  // Save todos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Function to add a new todo
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
      // Reset input fields after adding
      setNewTodo('')
      setNewTodoDueDate('')
      setNewTodoPriority('medium')
      setNewTodoCategory('personal')
    }
  }

  // Function to update an existing todo
  const updateTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ))
    setEditingId(null)
  }

  // Function to delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Function to toggle completion status of a todo
  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // Filtered todos based on search term, priority, and category
  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority === 'all' || todo.priority === filterPriority) &&
    (filterCategory === 'all' || todo.category === filterCategory)
  )
  // Calculate the percentage of completed todos
  const completedPercentage = (todos.filter(todo => todo.completed).length / todos.length) * 100 || 0

  // Priority color coding
  const priorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
    }
  }

  // Category color coding
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
                {/* Priority Picker */}
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
                {/* Category Picker */}
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
                {/* Add Todo Button */}
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
                    className="pl-10 bg-gray-800 text-purple-400"
                  />
                </div>
                {/* Priority Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Flag className="mr-2 h-4 w-4" />
                      {filterPriority === 'all' ? 'All Priorities' : filterPriority}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <Command>
                      <CommandInput placeholder="Filter by priority..." />
                      <CommandEmpty>No priority found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => setFilterPriority('all')}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterPriority === 'all' ? 'opacity-100' : 'opacity-0'}`}
                          />
                          All Priorities
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
                  </PopoverContent>
                </Popover>
                {/* Category Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      {filterCategory === 'all' ? 'All Categories' : filterCategory}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <Command>
                      <CommandInput placeholder="Filter by category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => setFilterCategory('all')}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterCategory === 'all' ? 'opacity-100' : 'opacity-0'}`}
                          />
                          All Categories
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
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredTodos.map(todo => (
            <Card key={todo.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingId === todo.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-gray-800 text-purple-400"
                    />
                  ) : (
                    todo.text
                  )}
                  <div className="flex items-center space-x-2">
                    {editingId === todo.id ? (
                      <Button variant="outline" size="sm" onClick={() => updateTodo(todo.id)}>
                        Save
                      </Button>
                    ) : (
                      <Edit2 className="cursor-pointer" onClick={() => {
                        setEditingId(todo.id)
                        setEditText(todo.text)
                      }} />
                    )}
                    <X className="cursor-pointer" onClick={() => deleteTodo(todo.id)} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className={`mr-2 ${priorityColor(todo.priority)}`}>
                    {todo.priority}
                  </Badge>
                  <Badge className={categoryColor(todo.category)}>
                    {todo.category}
                  </Badge>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Due: {todo.dueDate || 'No due date'}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Completion Progress</h2>
          <Progress value={completedPercentage} className=" bg-white w-full h-3 mt-2" />
        </div>
      </div>
    </div>
  )
}
