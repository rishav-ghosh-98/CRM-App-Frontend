import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment, getComments, getLeadsById } from "../api/leadApi";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import "./Leads.css";

const LeadManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentError, setCommentError] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeadsById(id);
        setLead(response.data.lead);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lead.");
      }

      try {
        const response = await getComments(id);
        setComments(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setCommentError(err.response?.data?.error || "Failed to fetch comments.");
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchLeads();
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      setCommentError("Comment text is required.");
      return;
    }

    setCommentError("");
    setIsAddingComment(true);
    try {
      const authorId = lead.salesAgent?._id || lead.salesAgent?.id;
      const response = await createComment(id, {
        commentText: trimmedComment,
        ...(authorId ? { author: authorId } : {}),
      });
      setComments((currentComments) => [...currentComments, response.data]);
      setCommentText("");
    } catch (err) {
      setCommentError(err.response?.data?.error || "Failed to add comment.");
    } finally {
      setIsAddingComment(false);
    }
  };

  if (error) {
    return <div className="leads-page"><p className="empty-leads">{error}</p></div>;
  }

  if (!lead) {
    return <div className="leads-page"><Loader /></div>;
  }

  return (
    <div className="leads-page lead-management-page">
      <div className="lead-management-header">
        <div>
          <button className="text-back-button" onClick={() => navigate("/leads")}>
            <FaArrowLeft />
            <span>Back to leads</span>
          </button>
          <p className="page-eyebrow">Lead record</p>
          <h1>{lead.name}</h1>
          <p className="page-subtitle">Review the latest details and ownership for this lead.</p>
        </div>
        <div className="lead-header-actions">
          <span className={`status status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}>{lead.status}</span>
          <button className="edit-button" type="button" onClick={() => navigate(`/leads/${id}/edit`)}>Edit details</button>
        </div>
      </div>

      <div className="lead-detail-layout">
        <section className="lead-details-card" aria-label="Lead details">
          <div className="detail-card-heading">
            <div>
              <p className="page-eyebrow">Overview</p>
              <h2>Lead details</h2>
            </div>
            <span className="lead-id">ID: {lead._id.slice(-8)}</span>
          </div>

          <div className="detail-grid">
            <div className="detail-item info-group">
              <span className="detail-label">Lead name</span>
              <span className="detail-value">{lead.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sales agent</span>
              <span className="detail-value">{lead.salesAgent?.name || "Unassigned"}</span>
              {lead.salesAgent?.email && <span className="detail-hint">{lead.salesAgent.email}</span>}
            </div>
            <div className="detail-item">
              <span className="detail-label">Lead source</span>
              <span className="detail-value">{lead.source}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Lead status</span>
              <span className={`detail-value status-text status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}>{lead.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <span className={`detail-value priority-${lead.priority.toLowerCase()}`}>{lead.priority}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estimated time to close</span>
              <span className="detail-value">{lead.timeToClose} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tags</span>
              <span className="lead-tags detail-tags">
                {lead.tags?.length ? lead.tags.map((tag) => (
                  <span className="lead-tag" key={tag}>{tag}</span>
                )) : <span className="lead-tag-empty">No tags</span>}
              </span>
            </div>
          </div>

          <div className="detail-footer">
            <button className="secondary-button" type="button" onClick={() => navigate("/leads")}>Return to lead list</button>
            <button className="edit-button" type="button" onClick={() => navigate(`/leads/${id}/edit`)}>Edit details</button>
          </div>
        </section>

        <section className="lead-comments-card" aria-label="Lead comments">
          <div className="detail-card-heading">
            <div>
              <p className="page-eyebrow">Activity</p>
              <h2>Comments</h2>
            </div>
            <span className="lead-id">{comments.length} updates</span>
          </div>

          {commentsLoading ? (
            <Loader />
          ) : comments.length ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <article className="comment-item" key={comment.id}>
                  <div className="comment-meta">
                    <strong>{comment.author || "Unknown author"}</strong>
                    <time dateTime={comment.createdAt}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p>{comment.commentText}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-leads">No comments have been added yet.</p>
          )}

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <label htmlFor="lead-comment">Add a comment</label>
            <textarea
              id="lead-comment"
              value={commentText}
              onChange={(event) => {
                setCommentText(event.target.value);
                setCommentError("");
              }}
              placeholder="Write an update about this lead..."
              rows="4"
              required
            />
            {commentError && <p className="form-error" role="alert">{commentError}</p>}
            <button className="edit-button" type="submit" disabled={isAddingComment}>
              {isAddingComment ? <Loader /> : "Add comment"}
            </button>
          </form>
        </section>

        <aside className="lead-side-panel">
          <div className="side-panel-icon"><FaArrowLeft /></div>
          <h2>Keep the record moving</h2>
          <p>Make sure this lead has an owner and a clear next step.</p>
          <button className="back-button" onClick={() => navigate("/")}>Back to dashboard</button>
        </aside>
      </div>
    </div>
  );
};

export default LeadManagement;
