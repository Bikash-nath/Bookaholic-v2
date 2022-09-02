import { Alert } from "react-bootstrap"

function Message({ variant, children, margin }) {
   return (
      <Alert variant={variant} className={margin}>
         {children}
      </Alert>
   )
}

export default Message
