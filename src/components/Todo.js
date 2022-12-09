import React from 'react'
import { Button, Card, Col, Input, List, Row, Typography } from 'antd';
import { useState } from 'react';
import { DeleteOutlined, EditTwoTone, MinusOutlined, PlusOutlined } from '@ant-design/icons';
const { Text } = Typography;

export default function Todo() {
  // state for enable input field
  const [visibleInput, setVisibleInput] = useState({
    review: false, pending: false, completed: false
  })
  // state for input field value
  const [todoInput, setTodoInput] = useState({
    review: "", pending: "", completed: ""
  })
  // state for todo tasks
  const [todoData, setTodoData] = useState({
    review: [], pending: [], completed: []
  })
  // state for edit key
  const [todoEditKey, setTodoEditKey] = useState({
    review: "", pending: "", completed: ""
  })
  // functions for drag and drop task
  const allowDrop = (ev) => {
    ev.preventDefault();
  }
  const drag = (ev, value, key, type) => {
    ev.dataTransfer.setData("data",
      JSON.stringify({ id: ev.target.id, value: value, key: key, type: type }));
  }
  const drop = (ev) => {
    ev.preventDefault();
    var data = JSON.parse(ev.dataTransfer.getData("data"));
    let tempdata = { ...todoData }
    if (data.type !== ev.target.id && ev.target.id !== "" && tempdata[ev.target.id] !== undefined) {
      tempdata[ev.target.id].push({ key: data.key, value: data.value })
      console.log(tempdata[ev.target.id]);
      tempdata[data.type].forEach((item, index) => {
        if (data.key === item.key)
          tempdata[data.type].splice(index, 1)
      });
    }
    setTodoData({ ...tempdata })
  }

  // Add task to TODO
  const handleAddTask = (value, type) => {
    if (value !== "") {
      let tempTodoData = todoData;
      if (todoEditKey[type] === "") {
        tempTodoData[type].push({
          key: Math.floor(Math.random() * 90000) + 1000000,
          value: value
        })
      } else {
        tempTodoData[type].forEach((item, index) => {
          console.log(item);
          if (item.key === todoEditKey[type]) {
            tempTodoData[type][index] = {
              key: item.key,
              value: value
            }
          }
        })
      }
      setTodoData({ ...tempTodoData })
      setTodoInput({ review: "", pending: "", completed: "" })
      setTodoEditKey({ review: "", pending: "", completed: "" })
    }
  }

  // edit TODO tasks
  const handleEdit = (value, key, type) => {
    let tempVisibleInput = visibleInput;
    tempVisibleInput[type] = true
    setVisibleInput({ ...tempVisibleInput })
    let tempTodoInput = todoInput;
    tempTodoInput[type] = value;
    setTodoInput({ ...tempTodoInput })
    let tempKey = todoEditKey;
    tempKey[type] = key
    setTodoEditKey({ ...tempKey });
  }

  // delete todo task 
  const handleDeleteTask = (key, type) => {
    let tempTodoData = { ...todoData };
    tempTodoData[type].forEach((item, index) => {
      if (item.key === key) {
        tempTodoData[type].splice(index, 1)
      }
    })
    setTodoData({ ...tempTodoData })
  }

  return (
    <Card  >
      <Row gutter={[16, 16]} >
        <Col span={8} >
          <Card title="Review"
            extra={<Button
              onClick={() => setVisibleInput({
                ...visibleInput,
                review: !visibleInput.review
              })}>{visibleInput.review ? <MinusOutlined /> : <PlusOutlined />}</Button>}
          >
            {visibleInput.review ?
              <Input placeholder="input Review task"
                onChange={(e) => setTodoInput({ ...todoInput, review: e.target.value })}
                value={todoInput.review}
                onPressEnter={() => handleAddTask(todoInput.review, "review")} /> :
              <></>
            }
            <List
              id="review"
              className="demo-loadmore-list"
              onDrop={(event) => drop(event)}
              onDragOver={(event) => allowDrop(event)}
              itemLayout="horizontal"
              dataSource={todoData?.review}
              renderItem={(item) => (

                <List.Item id={`item${Math.floor(Math.random() * 90000) + 10000}`}
                  onDragStart={(ev) => drag(ev, item.value, item.key, "review")}
                  draggable="true"
                  actions={[
                    <Button type="link" onClick={() => handleEdit(item.value, item.key, "review")}><EditTwoTone /></Button>,
                    <Button type="link" danger
                      onClick={() => handleDeleteTask(item.key, "review")}
                    ><DeleteOutlined /></Button>]}
                >
                  <Text>{item.value}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8} >
          <Card title="Pending"
            extra={<Button
              onClick={() => setVisibleInput({
                ...visibleInput,
                pending: !visibleInput.pending
              })}>{visibleInput.pending ? <MinusOutlined /> : <PlusOutlined />}</Button>}

          >
            {visibleInput.pending ?
              <Input placeholder="input Pending Task"
                onChange={(e) => setTodoInput({ ...todoInput, pending: e.target.value })}
                value={todoInput.pending}
                onPressEnter={() => handleAddTask(todoInput.pending, "pending")} /> :
              <></>
            }
            <List
              id="pending"
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={todoData?.pending}
              onDrop={(event) => drop(event)}
              onDragOver={(event) => allowDrop(event)}
              renderItem={(item) => (
                <List.Item id={`item${Math.floor(Math.random() * 90000) + 10000}`}
                  onDragStart={(event) => drag(event, item.value, item.key, "pending")}
                  draggable="true"
                  actions={[
                    <Button type="link" onClick={() => handleEdit(item.value, item.key, "pending")}><EditTwoTone /></Button>,
                    <Button type="link"
                      onClick={() => handleDeleteTask(item.key, "pending")}
                      danger size='large'><DeleteOutlined /></Button>]}
                >
                  <Text>{item.value}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8} >
          <Card title="Completed"
            extra={<Button
              onClick={() => setVisibleInput({
                ...visibleInput,
                completed: !visibleInput.completed
              })}>{visibleInput.completed ? <MinusOutlined /> : <PlusOutlined />}</Button>}
          >
            {visibleInput.completed ?
              <Input placeholder="input Completed Task"
                onChange={(e) => setTodoInput({ ...todoInput, completed: e.target.value })}
                value={todoInput.completed}
                onPressEnter={() => handleAddTask(todoInput.completed, "completed")} /> :
              <></>
            }
            <List
              id="completed"
              className="demo-loadmore-list"
              onDrop={(event) => drop(event)}
              onDragOver={(event) => allowDrop(event)}
              itemLayout="horizontal"
              dataSource={todoData?.completed}
              renderItem={(item, index) => (
                <List.Item id={`item${Math.floor(Math.random() * 90000) + 10000}`}
                  onDragStart={(ev) => drag(ev, item.value, item.key, "completed")}
                  draggable="true"
                  actions={[
                    <Button type="link" onClick={() => handleEdit(item.value, item.key, "completed")}><EditTwoTone /></Button>,
                    <Button type="link" danger
                      onClick={() => handleDeleteTask(item.key, "completed")}
                      size='large'><DeleteOutlined /></Button>]}
                >
                  <Text>{item.value}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
