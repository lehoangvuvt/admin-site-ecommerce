import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

const CreateRole = (props) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const createRole = async (values) => {
    await axios
      .post(
        "http://localhost:5035/permissions/roles/add-role",
        {
          ROLE_NAME: values.roleName.trim(),
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsLoading(false);
        handleCancle();
        form.resetFields();
        props.getRoles();
        console.log(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancle = () => {
    setVisible(false);
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    createRole(values);
  };

  return (
    <div>
      <Button
        style={{
          background: "#3f51b5",
          borderColor: "#3f51b5",
          color: "white",
        }}
        size="middle"
        onClick={handleOpen}
      >
        Create Role
      </Button>
      <Modal
        visible={visible}
        title="Create Role"
        okText="Create"
        cancelText="Cancel"
        confirmLoading={isLoading}
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
            name="roleName"
            label="Role Name"
            rules={[
              {
                required: true,
                message: "Please input Role's name",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateRole;
