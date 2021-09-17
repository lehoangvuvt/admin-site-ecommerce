import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import axios from "axios";

const CreateUser = (props) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancle = () => {
    setVisible(false);
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    createUser(values);
  };

  const createUser = async (values) => {
    await axios
      .post(
        "http://localhost:5035/permissions/user",
        {
          EMAIL: values.email.trim(),
          PASSWORD: values.password.trim(),
          FIRST_NAME: values.firstName.trim(),
          LAST_NAME: values.lastName.trim(),
          GENDER: values.gender,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsLoading(false);
        handleCancle();
        form.resetFields();
        props.getUsers();
        console.log(res.data);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  return (
    <div>
      <Button
        style={{
          background: "#3f51b5",
          borderColor: "#3f51b5",
          color: "white",
        }}
        type="primary"
        size="middle"
        onClick={handleOpen}
      >
        Create User
      </Button>
      <Modal
        visible={visible}
        confirmLoading={isLoading}
        title="Create User"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancle}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input first name!",
              },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input last name!",
              },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input email!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPass"
            label="Confirm Password"
            rules={[
              {
                validator: async (_, confirmPass) => {
                  if (confirmPass !== form.getFieldValue("password")) {
                    return Promise.reject(new Error("Password must match!"));
                  }
                },
              },
            ]}
          >
            <Input type="password" placeholder="Re-enter Password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUser;
